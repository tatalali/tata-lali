import type { MetadataRoute } from "next";
import { LOCALES, HREFLANG } from "@/i18n/config";

const SITE = "https://tatalali.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[HREFLANG[l]] = `${SITE}/${l}`;
  }
  languages["x-default"] = `${SITE}/fr`;

  return LOCALES.map((locale) => ({
    url: `${SITE}/${locale}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: locale === "fr" ? 1 : 0.8,
    alternates: { languages },
  }));
}
