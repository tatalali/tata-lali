export type Dictionary = {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: { brand: string; edition: string };
  hero: { tagline: string; h1: string; sub: string; cta: string };
  parti: { caption: string; h2: string; p1: string; p2: string; p3: string };
  audience: {
    caption: string;
    h2: string;
    cards: {
      ia: { h3: string; p: string };
      apprendre: { h3: string; p: string };
      ensemble: { h3: string; p: string };
    };
  };
  programme: {
    caption: string;
    h2: string;
    chapters: {
      ch1: { title: string; body: string };
      ch2: { title: string; body: string };
      ch3: { title: string; body: string };
      ch4: { title: string; body: string };
    };
  };
  ctaBuy: { tagline: string; h2: string; sub: string; cta: string };
  ctaSubscribe: {
    tagline: string;
    h2: string;
    sub: string;
    cta: string;
    placeholder: string;
    label: string;
    successCaption: string;
    successMsg: string;
    successFootnote: string;
    legal: string;
  };
  faq: {
    caption: string;
    h2: string;
    items: {
      q1: { q: string; a: string };
      q2: { q: string; a: string };
      q3: { q: string; a: string };
      q4: { q: string; a: string };
    };
  };
  footer: { brand: string; description: string; copyright: string; madeIn: string };
  buyButton: { paymentSecure: string; redirecting: string; errorDefault: string };
  merci: {
    badge: string;
    h1Top: string;
    h1Bottom: string;
    p1: string;
    p2: string;
    receipt: string;
    backHome: string;
  };
  picker: { label: string; close: string };
  preorderTag: string;
  /**
   * Banner shown on stub locales (highQuality === false) explaining the page is auto-translated.
   * Hand-translated locales also fill this field but the banner is not displayed.
   */
  noticeAuto: string;
  /**
   * If false, this locale is a stub (auto-generated, low quality).
   * The page shows a polite "auto-translated" notice and the hero h1 + CTA in the local language,
   * but body content stays in English fallback.
   */
  highQuality: boolean;
};
