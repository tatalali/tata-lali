import { NextRequest } from "next/server";
import { isValidLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tatalali.com";

// Stripe Checkout supports a fixed list of locales. We map our 24 locales to the
// closest Stripe-supported language; "auto" is the safest default when in doubt.
// https://docs.stripe.com/payments/checkout/customization/appearance#supported-locales
const STRIPE_LOCALES: Record<Locale, string> = {
  fr: "fr",
  en: "en-GB",
  de: "de",
  es: "es",
  it: "it",
  nl: "nl",
  pl: "pl",
  pt: "pt",
  cs: "cs",
  da: "da",
  fi: "fi",
  sv: "sv",
  el: "el",
  hu: "hu",
  ro: "ro",
  bg: "bg",
  hr: "hr",
  sk: "sk",
  sl: "sl",
  lv: "lv",
  lt: "lt",
  et: "et",
  mt: "en-GB",
  ga: "en-GB",
};

const PRODUCT_NAME: Record<Locale, string> = {
  fr: "Tata Lali — Pré-réservation",
  en: "Tata Lali — Pre-order",
  de: "Tata Lali — Vorbestellung",
  es: "Tata Lali — Reserva",
  it: "Tata Lali — Prenotazione",
  nl: "Tata Lali — Voorinschrijving",
  pl: "Tata Lali — Przedsprzedaż",
  pt: "Tata Lali — Reserva",
  cs: "Tata Lali — Předobjednávka",
  da: "Tata Lali — Forudbestilling",
  fi: "Tata Lali — Ennakkotilaus",
  sv: "Tata Lali — Förbeställning",
  el: "Tata Lali — Προπαραγγελία",
  hu: "Tata Lali — Előrendelés",
  ro: "Tata Lali — Precomandă",
  bg: "Tata Lali — Предварителна поръчка",
  hr: "Tata Lali — Prednarudžba",
  sk: "Tata Lali — Predobjednávka",
  sl: "Tata Lali — Prednaročilo",
  lv: "Tata Lali — Iepriekšpasūtījums",
  lt: "Tata Lali — Išankstinis užsakymas",
  et: "Tata Lali — Eeltellimus",
  mt: "Tata Lali — Pre-ordni",
  ga: "Tata Lali — Réamhordú",
};

const PRODUCT_DESC: Record<Locale, string> = {
  fr: "30 leçons pour apprendre l'IA, sans paniquer. Livraison printemps 2026 par mail.",
  en: "30 lessons to learn AI, without panic. Delivered by email, spring 2026.",
  de: "30 Lektionen, um KI zu lernen, ohne Panik. Lieferung per E-Mail, Frühjahr 2026.",
  es: "30 lecciones para aprender IA, sin pánico. Entrega por email, primavera 2026.",
  it: "30 lezioni per imparare l'IA, senza panico. Consegna via email, primavera 2026.",
  nl: "30 lessen om AI te leren, zonder paniek. Levering per e-mail, voorjaar 2026.",
  pl: "30 lekcji, by nauczyć się SI, bez paniki. Dostawa e-mailem, wiosna 2026.",
  pt: "30 lições para aprender IA, sem pânico. Entrega por e-mail, primavera 2026.",
  cs: "30 lekcí, jak se naučit AI bez paniky. Doručení e-mailem, jaro 2026.",
  da: "30 lektioner til at lære AI uden panik. Leveres via e-mail, forår 2026.",
  fi: "30 oppituntia oppia tekoälyä ilman paniikkia. Toimitus sähköpostitse, kevät 2026.",
  sv: "30 lektioner för att lära sig AI, utan panik. Levereras via e-post, våren 2026.",
  el: "30 μαθήματα για να μάθετε την τεχνητή νοημοσύνη, χωρίς πανικό. Παράδοση μέσω email, άνοιξη 2026.",
  hu: "30 lecke a mesterséges intelligencia tanulásához, pánik nélkül. E-mailben, 2026 tavasza.",
  ro: "30 de lecții pentru a învăța IA, fără panică. Livrare prin email, primăvara 2026.",
  bg: "30 урока, за да научите ИИ, без паника. Доставка по имейл, пролет 2026.",
  hr: "30 lekcija za učenje umjetne inteligencije, bez panike. Dostava e-mailom, proljeće 2026.",
  sk: "30 lekcií, ako sa naučiť AI bez paniky. Doručenie e-mailom, jar 2026.",
  sl: "30 lekcij za učenje umetne inteligence, brez panike. Dostava po e-pošti, pomlad 2026.",
  lv: "30 nodarbības, kā apgūt mākslīgo intelektu bez panikas. Piegāde pa e-pastu, 2026. gada pavasaris.",
  lt: "30 pamokų išmokti DI be panikos. Pristatymas el. paštu, 2026 m. pavasaris.",
  et: "30 õppetundi tehisintellekti õppimiseks, paanikata. Tarne meili teel, kevad 2026.",
  mt: "30 lezzjoni biex titgħallem l-IA mingħajr paniku. Konsenja bl-email, rebbiegħa 2026.",
  ga: "30 ceacht chun IS a fhoghlaim, gan scaoll. Seachadta trí ríomhphost, earrach 2026.",
};

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return Response.json(
      { ok: false, code: "stripe_not_configured" },
      { status: 503 },
    );
  }

  let source = "cta-buy";
  let locale: Locale = DEFAULT_LOCALE;
  try {
    const body = (await request.json()) as {
      source?: unknown;
      locale?: unknown;
    };
    if (typeof body.source === "string" && body.source.length < 60) {
      source = body.source;
    }
    if (typeof body.locale === "string" && isValidLocale(body.locale)) {
      locale = body.locale as Locale;
    }
  } catch {
    // body optional — silent
  }

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("payment_method_types[]", "card");
  params.append("line_items[0][quantity]", "1");
  params.append("line_items[0][price_data][currency]", "eur");
  params.append("line_items[0][price_data][unit_amount]", "200");
  params.append(
    "line_items[0][price_data][product_data][name]",
    PRODUCT_NAME[locale],
  );
  params.append(
    "line_items[0][price_data][product_data][description]",
    PRODUCT_DESC[locale],
  );
  params.append(
    "success_url",
    `${SITE}/${locale}/merci?session_id={CHECKOUT_SESSION_ID}`,
  );
  params.append("cancel_url", `${SITE}/${locale}`);
  params.append("allow_promotion_codes", "false");
  params.append("billing_address_collection", "auto");
  params.append("locale", STRIPE_LOCALES[locale]);
  params.append("metadata[source]", source);
  params.append("metadata[locale]", locale);
  params.append("metadata[product]", "tata-lali-pre-order-v1");

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = (await res.json().catch(() => ({}))) as {
      url?: string;
      id?: string;
      error?: { message?: string };
    };

    if (!res.ok || !data.url) {
      console.error("[checkout] Stripe error", res.status, data.error);
      return Response.json(
        { ok: false, code: "stripe_error" },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, url: data.url, id: data.id });
  } catch (err) {
    console.error("[checkout] fetch Stripe failed", err);
    return Response.json(
      { ok: false, code: "network_error" },
      { status: 502 },
    );
  }
}
