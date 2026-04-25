import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const SITE = "https://tatalali.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Tata Lali — Apprendre l'IA, sans paniquer.",
    template: "%s · Tata Lali",
  },
  description:
    "Un manuel illustré pour apprivoiser l'IA. Pour les 45-65 ans qui veulent comprendre, sans se faire avoir. Pré-inscriptions ouvertes — printemps 2026.",
  applicationName: "Tata Lali",
  authors: [{ name: "Tata Lali" }],
  keywords: [
    "apprendre l'IA",
    "intelligence artificielle pour débutants",
    "ChatGPT pour seniors",
    "formation IA français",
    "IA pour 45-65 ans",
    "comprendre l'IA",
    "Tata Lali",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
      "fr-BE": "/",
      "fr-CH": "/",
      "fr-CA": "/",
    },
  },
  openGraph: {
    title: "Tata Lali — Apprendre l'IA, sans paniquer.",
    description:
      "Un manuel illustré pour apprivoiser l'IA. Pour les 45-65 ans. Pré-inscriptions ouvertes.",
    url: SITE,
    siteName: "Tata Lali",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tata Lali — Apprendre l'IA, sans paniquer.",
    description:
      "Un manuel illustré pour apprivoiser l'IA. Pour les 45-65 ans.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#F2EDE4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${interTight.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
