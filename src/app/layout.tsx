import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { PreferencesProvider } from "@/components/trico/preferences-provider";
import { AuthSessionProvider } from "@/components/trico/auth-session-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tricô — as notícias do teu sector, tecidas para ti",
    template: "%s · Tricô",
  },
  description:
    "Plataforma angolana que agrega, filtra e resume as notícias do teu sector — por hora, dia, semana e ano.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Tricô",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#002147",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${manrope.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthSessionProvider>
          <PreferencesProvider>{children}</PreferencesProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
