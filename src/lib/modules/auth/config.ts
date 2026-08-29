/**
 * Configuração Auth.js (NextAuth v5).
 * - Email/password (Credentials) com Postgres.
 * - Google / Apple com AUTH_GOOGLE_* / AUTH_APPLE_* (sem linking perigoso).
 * - Admins via ADMIN_EMAILS + email verificado (ou bootstrap).
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { ensureAdminRole, isAdminEmail } from "@/lib/modules/auth/roles";
import { requireAuthSecret } from "@/lib/security/secrets";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { isEmailConfigured } from "@/lib/modules/auth/verification";
import type { NextAuthConfig } from "next-auth";
import { CredentialsSignin } from "next-auth";

class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}

function socialProviders() {
  const providers = [];
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        // Sem allowDangerousEmailAccountLinking — evita takeover via Credentials
      }),
    );
  }
  if (process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET) {
    providers.push(
      Apple({
        clientId: process.env.AUTH_APPLE_ID,
        clientSecret: process.env.AUTH_APPLE_SECRET,
      }),
    );
  }
  return providers;
}

export const authConfig: NextAuthConfig = {
  ...(prisma ? { adapter: PrismaAdapter(prisma) } : {}),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/entrar",
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Palavra-passe", type: "password" },
      },
      async authorize(credentials, request) {
        if (!prisma) return null;
        const email = String(credentials?.email || "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const ip = request ? clientIp(request) : "unknown";
        const rl = rateLimit(`login:${ip}:${email}`, 10, 15 * 60 * 1000);
        if (!rl.ok) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Com Resend activo, Credentials exige email confirmado
        if (isEmailConfigured() && !user.emailVerified) {
          const pending = await prisma.verificationToken.findFirst({
            where: { identifier: email },
          });
          if (pending) {
            throw new EmailNotVerifiedError();
          }
          // Conta anterior ao fluxo de email — confirma na primeira entrada
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
          });
        }

        await ensureAdminRole(user.id, user.email, {
          emailVerified: user.emailVerified || new Date(),
        });

        const refreshed = await prisma.user.findUnique({ where: { id: user.id } });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: refreshed?.role || user.role || "user",
        };
      },
    }),
    ...socialProviders(),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (user?.id && user.email) {
        const oauthVerified =
          account?.provider === "google" || account?.provider === "apple";
        await ensureAdminRole(user.id, user.email, {
          emailVerified: oauthVerified ? new Date() : undefined,
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        const role =
          ("role" in user && typeof user.role === "string" && user.role) ||
          "user";
        // Não promover só por email no JWT sem verificação — role vem da BD
        token.role = role;
      } else if (token.sub && prisma) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, email: true, emailVerified: true },
        });
        if (dbUser) {
          if (isAdminEmail(dbUser.email) && dbUser.role !== "admin") {
            const promoted = await ensureAdminRole(token.sub, dbUser.email, {
              emailVerified: dbUser.emailVerified,
            });
            token.role = promoted ? "admin" : dbUser.role;
          } else {
            token.role = dbUser.role;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) || "user";
      }
      return session;
    },
  },
  trustHost: true,
  secret: requireAuthSecret(),
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export function getAuthFlags() {
  return {
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    apple: Boolean(process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET),
    credentials: Boolean(prisma),
    database: Boolean(prisma),
    email: isEmailConfigured(),
  };
}
