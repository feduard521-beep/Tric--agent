/**
 * Configuração Auth.js (NextAuth v5).
 * - Email/password (Credentials) activo com Postgres.
 * - Google / Apple com AUTH_GOOGLE_* / AUTH_APPLE_*.
 * - Admins via ADMIN_EMAILS (ex.: feduard521@gmail.com).
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { ensureAdminRole, isAdminEmail } from "@/lib/modules/auth/roles";
import type { NextAuthConfig } from "next-auth";

function socialProviders() {
  const providers = [];
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }
  if (process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET) {
    providers.push(
      Apple({
        clientId: process.env.AUTH_APPLE_ID,
        clientSecret: process.env.AUTH_APPLE_SECRET,
        allowDangerousEmailAccountLinking: true,
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
      async authorize(credentials) {
        if (!prisma) return null;
        const email = String(credentials?.email || "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        await ensureAdminRole(user.id, user.email);

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
    async signIn({ user }) {
      if (user?.id && user.email) {
        await ensureAdminRole(user.id, user.email);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        const role =
          ("role" in user && typeof user.role === "string" && user.role) ||
          (isAdminEmail(user.email) ? "admin" : "user");
        token.role = role;
      } else if (token.sub && prisma) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, email: true },
        });
        if (dbUser) {
          if (isAdminEmail(dbUser.email) && dbUser.role !== "admin") {
            await ensureAdminRole(token.sub, dbUser.email);
            token.role = "admin";
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
  secret: process.env.AUTH_SECRET || "trico-build-placeholder-change-me",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export function getAuthFlags() {
  return {
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    apple: Boolean(process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET),
    credentials: Boolean(prisma),
    database: Boolean(prisma),
  };
}
