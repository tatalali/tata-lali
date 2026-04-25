import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return {
    title: `${dict.merci.h1Top} ${dict.merci.h1Bottom} — Tata Lali`,
    description: dict.merci.p1,
    robots: { index: false, follow: false },
  };
}

export default async function Merci({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <main className="flex-1 flex items-center justify-center px-6 md:px-10 py-32">
      <div className="max-w-[640px] mx-auto text-center space-y-8">
        <span className="tag-band mb-2">{dict.merci.badge}</span>
        <h1 className="h-display text-[44px] md:text-[64px] leading-[1.05]">
          {dict.merci.h1Top}
          <br />
          {dict.merci.h1Bottom}
        </h1>
        <div className="space-y-4 text-[17px] md:text-[19px] leading-relaxed opacity-80">
          <p>{dict.merci.p1}</p>
          <p>{dict.merci.p2}</p>
          <p className="opacity-70">{dict.merci.receipt}</p>
        </div>
        <a href={`/${locale}`} className="caption underline">
          {dict.merci.backHome}
        </a>
      </div>
    </main>
  );
}
