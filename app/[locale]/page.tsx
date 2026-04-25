import { notFound } from "next/navigation";
import { isValidLocale, type Locale, HREFLANG } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { InscriptionForm } from "../components/inscription-form";
import { BuyButton } from "../components/buy-button";
import { LanguageSwitcher } from "../components/language-switcher";

const SITE = "https://tatalali.com";

function Picto({ name }: { name: "ia" | "apprendre" | "ensemble" }) {
  const stroke = "#1A1A1A";
  if (name === "ia") {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
        <rect x="14" y="22" width="36" height="28" stroke={stroke} strokeWidth="2" />
        <line x1="22" y1="22" x2="22" y2="14" stroke={stroke} strokeWidth="2" />
        <line x1="32" y1="22" x2="32" y2="12" stroke={stroke} strokeWidth="2" />
        <line x1="42" y1="22" x2="42" y2="14" stroke={stroke} strokeWidth="2" />
        <circle cx="25" cy="34" r="2" fill={stroke} />
        <circle cx="39" cy="34" r="2" fill={stroke} />
        <line x1="22" y1="44" x2="42" y2="44" stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }
  if (name === "apprendre") {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
        <circle cx="22" cy="18" r="6" stroke={stroke} strokeWidth="2" />
        <path d="M14 32 q8 -8 16 0" stroke={stroke} strokeWidth="2" fill="none" />
        <line x1="14" y1="32" x2="14" y2="44" stroke={stroke} strokeWidth="2" />
        <line x1="30" y1="32" x2="30" y2="44" stroke={stroke} strokeWidth="2" />
        <rect x="34" y="30" width="20" height="14" stroke={stroke} strokeWidth="2" />
        <line x1="44" y1="30" x2="44" y2="44" stroke={stroke} strokeWidth="2" />
        <line x1="38" y1="36" x2="42" y2="36" stroke={stroke} strokeWidth="2" />
        <line x1="46" y1="36" x2="50" y2="36" stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="14" cy="22" r="5" stroke={stroke} strokeWidth="2" />
      <path d="M6 38 q8 -8 16 0" stroke={stroke} strokeWidth="2" fill="none" />
      <line x1="6" y1="38" x2="6" y2="50" stroke={stroke} strokeWidth="2" />
      <line x1="22" y1="38" x2="22" y2="50" stroke={stroke} strokeWidth="2" />
      <circle cx="32" cy="18" r="6" stroke={stroke} strokeWidth="2" />
      <path d="M22 36 q10 -10 20 0" stroke={stroke} strokeWidth="2" fill="none" />
      <line x1="22" y1="36" x2="22" y2="50" stroke={stroke} strokeWidth="2" />
      <line x1="42" y1="36" x2="42" y2="50" stroke={stroke} strokeWidth="2" />
      <circle cx="50" cy="22" r="5" stroke={stroke} strokeWidth="2" />
      <path d="M42 38 q8 -8 16 0" stroke={stroke} strokeWidth="2" fill="none" />
      <line x1="42" y1="38" x2="42" y2="50" stroke={stroke} strokeWidth="2" />
      <line x1="58" y1="38" x2="58" y2="50" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

function Chapter({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <section className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-16 items-start">
      <div>
        <div className="chapter-num">{num}</div>
        <span className="divider-short mt-4" aria-hidden />
      </div>
      <div className="space-y-4">
        <h3 className="h-display text-[24px] md:text-[32px]">{title}</h3>
        <div className="space-y-4 text-[17px] md:text-[19px] leading-relaxed">
          <p>{body}</p>
        </div>
      </div>
    </section>
  );
}

function renderHeading(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: dict.meta.title,
    description: dict.meta.description,
    provider: {
      "@type": "Organization",
      name: "Tata Lali",
      url: SITE,
    },
    inLanguage: HREFLANG[locale],
    educationalLevel: "Beginner",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "adultLearner",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: HREFLANG[locale],
      courseWorkload: "PT5H",
      startDate: "2026-04-01",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      price: "2.00",
      priceCurrency: "EUR",
      url: `${SITE}/${locale}`,
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tata Lali",
    url: SITE,
    description: dict.meta.description,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: dict.faq.items.q1.q, acceptedAnswer: { "@type": "Answer", text: dict.faq.items.q1.a } },
      { "@type": "Question", name: dict.faq.items.q2.q, acceptedAnswer: { "@type": "Answer", text: dict.faq.items.q2.a } },
      { "@type": "Question", name: dict.faq.items.q3.q, acceptedAnswer: { "@type": "Answer", text: dict.faq.items.q3.a } },
      { "@type": "Question", name: dict.faq.items.q4.q, acceptedAnswer: { "@type": "Answer", text: dict.faq.items.q4.a } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="flex-1">
        <header className="px-6 md:px-10 pt-8 md:pt-12">
          <div className="max-w-[1120px] mx-auto flex items-baseline justify-between gap-4">
            <p className="caption">{dict.header.brand}</p>
            <div className="flex items-center gap-4">
              <p className="caption opacity-60 hidden md:block">{dict.header.edition}</p>
              <LanguageSwitcher currentLocale={locale} dict={dict} />
            </div>
          </div>
        </header>

        {!dict.highQuality && (
          <div className="px-6 md:px-10 pt-6">
            <div className="max-w-[1120px] mx-auto">
              <div
                role="note"
                className="text-[14px] md:text-[15px] leading-relaxed border border-[color:var(--color-rule)] px-4 py-3 opacity-70"
              >
                {/* noticeAuto field comes from stub builder; safe to pull dynamically */}
                {(dict as unknown as { noticeAuto?: string }).noticeAuto ??
                  "This page is auto-translated. The original is in English below."}
              </div>
            </div>
          </div>
        )}

        <section className="px-6 md:px-10 pt-20 md:pt-32 pb-20 md:pb-32">
          <div className="max-w-[720px] mx-auto">
            <span className="tag-band mb-8">{dict.hero.tagline}</span>
            <h1 className="h-display text-[44px] md:text-[72px] leading-[1.02] mb-8">
              {renderHeading(dict.hero.h1)}
            </h1>
            <p className="text-[19px] md:text-[22px] leading-relaxed max-w-[560px] opacity-80 mb-10">
              {dict.hero.sub}
            </p>
            <BuyButton source="hero" label={dict.hero.cta} locale={locale} dict={dict} />
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <section className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-[720px] mx-auto space-y-8">
            <p className="caption">{dict.parti.caption}</p>
            <h2 className="h-display text-[28px] md:text-[40px]">
              {renderHeading(dict.parti.h2)}
            </h2>
            <div className="space-y-5 text-[17px] md:text-[19px] leading-relaxed">
              <p>{dict.parti.p1}</p>
              <p>{dict.parti.p2}</p>
              <p>{dict.parti.p3}</p>
            </div>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <section className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-[1120px] mx-auto">
            <div className="max-w-[720px] mb-16 md:mb-20 space-y-4">
              <p className="caption">{dict.audience.caption}</p>
              <h2 className="h-display text-[28px] md:text-[40px]">
                {dict.audience.h2}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-16">
              <div className="space-y-4">
                <Picto name="ia" />
                <h3 className="h-display text-[20px] md:text-[22px]">
                  {dict.audience.cards.ia.h3}
                </h3>
                <p className="text-[16px] md:text-[17px] leading-relaxed opacity-80">
                  {dict.audience.cards.ia.p}
                </p>
              </div>

              <div className="space-y-4">
                <Picto name="apprendre" />
                <h3 className="h-display text-[20px] md:text-[22px]">
                  {dict.audience.cards.apprendre.h3}
                </h3>
                <p className="text-[16px] md:text-[17px] leading-relaxed opacity-80">
                  {dict.audience.cards.apprendre.p}
                </p>
              </div>

              <div className="space-y-4">
                <Picto name="ensemble" />
                <h3 className="h-display text-[20px] md:text-[22px]">
                  {dict.audience.cards.ensemble.h3}
                </h3>
                <p className="text-[16px] md:text-[17px] leading-relaxed opacity-80">
                  {dict.audience.cards.ensemble.p}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <section className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-[720px] mx-auto">
            <div className="mb-16 md:mb-20 space-y-4">
              <p className="caption">{dict.programme.caption}</p>
              <h2 className="h-display text-[28px] md:text-[40px]">
                {dict.programme.h2}
              </h2>
            </div>

            <div className="space-y-16 md:space-y-20">
              <Chapter num="01" title={dict.programme.chapters.ch1.title} body={dict.programme.chapters.ch1.body} />
              <Chapter num="02" title={dict.programme.chapters.ch2.title} body={dict.programme.chapters.ch2.body} />
              <Chapter num="03" title={dict.programme.chapters.ch3.title} body={dict.programme.chapters.ch3.body} />
              <Chapter num="04" title={dict.programme.chapters.ch4.title} body={dict.programme.chapters.ch4.body} />
            </div>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <section className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-[720px] mx-auto space-y-12">
            <div>
              <span className="tag-band mb-8">{dict.ctaBuy.tagline}</span>
              <h2 className="h-display text-[32px] md:text-[44px] mb-6">
                {dict.ctaBuy.h2}
              </h2>
              <p className="text-[17px] md:text-[19px] opacity-80 mb-10 leading-relaxed">
                {dict.ctaBuy.sub}
              </p>
              <BuyButton source="cta-bas" label={dict.ctaBuy.cta} locale={locale} dict={dict} />
            </div>

            <div className="divider-rule" />

            <div>
              <span className="tag-band mb-8">{dict.ctaSubscribe.tagline}</span>
              <h2 className="h-display text-[28px] md:text-[36px] mb-6">
                {dict.ctaSubscribe.h2}
              </h2>
              <p className="text-[17px] md:text-[19px] opacity-80 mb-10 leading-relaxed">
                {dict.ctaSubscribe.sub}
              </p>
              <InscriptionForm source="cta-bas" locale={locale} dict={dict} />
            </div>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <section className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-[720px] mx-auto">
            <div className="mb-12 space-y-4">
              <p className="caption">{dict.faq.caption}</p>
              <h2 className="h-display text-[28px] md:text-[40px]">
                {dict.faq.h2}
              </h2>
            </div>

            <dl className="space-y-12">
              {(["q1", "q2", "q3", "q4"] as const).map((k) => (
                <div key={k} className="space-y-3">
                  <dt className="h-display text-[19px] md:text-[22px]">
                    {dict.faq.items[k].q}
                  </dt>
                  <dd className="text-[17px] md:text-[19px] leading-relaxed opacity-80">
                    {dict.faq.items[k].a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <footer className="px-6 md:px-10 py-12 md:py-16">
          <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <p className="h-display text-[20px]">{dict.footer.brand}</p>
              <p className="text-[14px] opacity-60 max-w-[420px] leading-relaxed">
                {dict.footer.description}
              </p>
              <p className="text-[13px] opacity-60 mt-2">
                <span className="tag-band">{dict.footer.madeIn}</span>
              </p>
            </div>
            <p className="caption opacity-60">{dict.footer.copyright}</p>
          </div>
        </footer>
      </main>
    </>
  );
}
