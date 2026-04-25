import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";
import {
  HREFLANG,
  LOCALES,
  OG_LOCALE,
  type Locale,
  isValidLocale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const SITE = "https://tatalali.com";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[HREFLANG[l]] = `/${l}`;
  }
  languages["x-default"] = "/fr";

  return {
    metadataBase: new URL(SITE),
    title: { default: dict.meta.title, template: `%s · Tata Lali` },
    description: dict.meta.description,
    applicationName: "Tata Lali",
    authors: [{ name: "Tata Lali" }],
    keywords: dict.meta.keywords,
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${SITE}/${locale}`,
      siteName: "Tata Lali",
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALE[l],
      ),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
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
}

export const viewport: Viewport = {
  themeColor: "#F2EDE4",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <html lang={locale} className={`${interTight.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
