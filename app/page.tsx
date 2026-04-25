import { InscriptionForm } from "./components/inscription-form";
import { BuyButton } from "./components/buy-button";

const SITE = "https://tatalali.com";

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Tata Lali — Apprendre l'IA, sans paniquer.",
  description:
    "Un manuel illustré pour apprivoiser l'intelligence artificielle, conçu pour les 45-65 ans.",
  provider: {
    "@type": "Organization",
    name: "Tata Lali",
    url: SITE,
  },
  inLanguage: "fr",
  educationalLevel: "Beginner",
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "adultLearner",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    inLanguage: "fr",
    courseWorkload: "PT5H",
    startDate: "2026-04-01",
  },
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/PreOrder",
    price: "2.00",
    priceCurrency: "EUR",
    url: SITE,
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tata Lali",
  url: SITE,
  description:
    "Manuel illustré pour apprivoiser l'IA, à destination des francophones 45-65 ans.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Faut-il déjà s'y connaître ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. On part du début. Si vous savez ouvrir un onglet, vous saurez utiliser ce manuel.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de temps ça prend ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une leçon = dix minutes. Vous tenez le rythme que vous voulez.",
      },
    },
    {
      "@type": "Question",
      name: "C'est quoi le format exact ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un livret illustré, en ligne, pensé comme un manuel. Pas de vidéo. Pas de live. Vous lisez, vous testez, vous fermez l'onglet.",
      },
    },
    {
      "@type": "Question",
      name: "Quand ça ouvre ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Printemps 2026. Vous recevrez un seul message, le jour de l'ouverture.",
      },
    },
  ],
};

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
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
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
          {children}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        <header className="px-6 md:px-10 pt-8 md:pt-12">
          <div className="max-w-[1120px] mx-auto flex items-baseline justify-between">
            <p className="caption">Tata Lali</p>
            <p className="caption opacity-60">Manuel · Édition 01 · Printemps 2026</p>
          </div>
        </header>

        <section className="px-6 md:px-10 pt-20 md:pt-32 pb-20 md:pb-32">
          <div className="max-w-[720px] mx-auto">
            <span className="tag-band mb-8">Pré-réservations · 2€</span>
            <h1 className="h-display text-[44px] md:text-[72px] leading-[1.02] mb-8">
              Apprendre l'IA,<br />sans paniquer.
            </h1>
            <p className="text-[19px] md:text-[22px] leading-relaxed max-w-[560px] opacity-80 mb-10">
              Un manuel illustré, pour les 45-65 ans qui veulent comprendre
              l'intelligence artificielle. Sans jargon, sans peur, sans
              survendre.
            </p>
            <BuyButton source="hero" label="Réserver pour 2€" />
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <section className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-[720px] mx-auto space-y-8">
            <p className="caption">Le parti pris</p>
            <h2 className="h-display text-[28px] md:text-[40px]">
              L'IA n'est pas une révolution.<br />
              C'est un nouvel outil de bureau.
            </h2>
            <div className="space-y-5 text-[17px] md:text-[19px] leading-relaxed">
              <p>
                On vous a dit que l'IA allait tout changer. C'est vrai à
                moitié. Elle change ce que vous faites devant un écran ; elle
                ne change pas qui vous êtes.
              </p>
              <p>
                Tata Lali n'est pas une formation accélérée. Pas un cours
                magistral. Pas un coach énergique qui vous promet de
                « débloquer votre potentiel ».
              </p>
              <p>
                C'est un livret. Vous l'ouvrez quand vous voulez, vous lisez
                une page, vous testez sur votre ordinateur, vous fermez. Le
                lendemain, la suivante.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <section className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-[1120px] mx-auto">
            <div className="max-w-[720px] mb-16 md:mb-20 space-y-4">
              <p className="caption">À qui c'est destiné</p>
              <h2 className="h-display text-[28px] md:text-[40px]">
                Pour les gens qui n'ont pas grandi avec ça.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-16">
              <div className="space-y-4">
                <Picto name="ia" />
                <h3 className="h-display text-[20px] md:text-[22px]">
                  Vous avez entendu parler de ChatGPT.
                </h3>
                <p className="text-[16px] md:text-[17px] leading-relaxed opacity-80">
                  Vous n'avez pas encore osé l'ouvrir, ou vous l'avez essayé
                  une fois et trouvé ça bizarre. Normal.
                </p>
              </div>

              <div className="space-y-4">
                <Picto name="apprendre" />
                <h3 className="h-display text-[20px] md:text-[22px]">
                  Vous voulez comprendre, pas juste utiliser.
                </h3>
                <p className="text-[16px] md:text-[17px] leading-relaxed opacity-80">
                  Pas une recette à recopier. Vous voulez savoir ce qu'il y a
                  derrière le rideau. Et ce qu'il n'y a pas.
                </p>
              </div>

              <div className="space-y-4">
                <Picto name="ensemble" />
                <h3 className="h-display text-[20px] md:text-[22px]">
                  Vous n'aimez pas être pris·e pour un·e novice.
                </h3>
                <p className="text-[16px] md:text-[17px] leading-relaxed opacity-80">
                  Vous avez une vie, un métier, des compétences. On vous parle
                  comme à un adulte qui apprend une chose nouvelle.
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
              <p className="caption">Comment c'est fait</p>
              <h2 className="h-display text-[28px] md:text-[40px]">
                Trente leçons. Une par jour, ou pas.
              </h2>
            </div>

            <div className="space-y-16 md:space-y-20">
              <Chapter num="01" title="Comprendre ce que c'est, vraiment.">
                <p>
                  Trois leçons pour démêler le vrai du marketing. Ce que fait
                  une IA. Ce qu'elle ne fait pas. Pourquoi elle se trompe avec
                  aplomb.
                </p>
              </Chapter>

              <Chapter num="02" title="Apprendre à lui parler.">
                <p>
                  Onze leçons pour formuler une demande qui marche. Sans
                  formule magique. Avec des exemples vrais : un mail, une
                  recette, un CV, une lettre.
                </p>
              </Chapter>

              <Chapter num="03" title="Ne pas se faire avoir.">
                <p>
                  Huit leçons pour repérer un faux, vérifier une source,
                  garder vos données pour vous. La partie qui ne se trouve
                  pas sur YouTube.
                </p>
              </Chapter>

              <Chapter num="04" title="L'intégrer dans votre semaine.">
                <p>
                  Huit leçons pratiques. Ce que vous pouvez vraiment lui
                  déléguer. Ce qu'il vaut mieux faire à la main. Le bon
                  équilibre, pour vous.
                </p>
              </Chapter>
            </div>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <section className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-[720px] mx-auto space-y-12">
            <div>
              <span className="tag-band mb-8">Réserver maintenant · 2€</span>
              <h2 className="h-display text-[32px] md:text-[44px] mb-6">
                Bloquez votre place pour 2€.
              </h2>
              <p className="text-[17px] md:text-[19px] opacity-80 mb-10 leading-relaxed">
                30 leçons, une par jour, à votre rythme. Livraison printemps
                2026 par mail. Paiement Stripe sécurisé.
              </p>
              <BuyButton source="cta-bas" label="Réserver pour 2€" />
            </div>

            <div className="divider-rule" />

            <div>
              <span className="tag-band mb-8">Ou laissez juste un mail</span>
              <h2 className="h-display text-[28px] md:text-[36px] mb-6">
                Pas prêt·e à payer ? Gardez juste un fil.
              </h2>
              <p className="text-[17px] md:text-[19px] opacity-80 mb-10 leading-relaxed">
                On vous envoie un seul message le jour de l'ouverture. Aucun
                spam. Aucune newsletter.
              </p>
              <InscriptionForm source="cta-bas" />
            </div>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <section className="px-6 md:px-10 py-20 md:py-32">
          <div className="max-w-[720px] mx-auto">
            <div className="mb-12 space-y-4">
              <p className="caption">Précisions</p>
              <h2 className="h-display text-[28px] md:text-[40px]">
                Ce qu'on nous demande souvent.
              </h2>
            </div>

            <dl className="space-y-12">
              <div className="space-y-3">
                <dt className="h-display text-[19px] md:text-[22px]">
                  Faut-il déjà s'y connaître&nbsp;?
                </dt>
                <dd className="text-[17px] md:text-[19px] leading-relaxed opacity-80">
                  Non. On part du début. Si vous savez ouvrir un onglet, vous
                  saurez utiliser ce manuel.
                </dd>
              </div>

              <div className="space-y-3">
                <dt className="h-display text-[19px] md:text-[22px]">
                  Combien de temps ça prend&nbsp;?
                </dt>
                <dd className="text-[17px] md:text-[19px] leading-relaxed opacity-80">
                  Une leçon = dix minutes. Vous tenez le rythme que vous
                  voulez.
                </dd>
              </div>

              <div className="space-y-3">
                <dt className="h-display text-[19px] md:text-[22px]">
                  C'est quoi le format exact&nbsp;?
                </dt>
                <dd className="text-[17px] md:text-[19px] leading-relaxed opacity-80">
                  Un livret illustré, en ligne, pensé comme un manuel. Pas de
                  vidéo. Pas de live. Vous lisez, vous testez, vous fermez
                  l'onglet.
                </dd>
              </div>

              <div className="space-y-3">
                <dt className="h-display text-[19px] md:text-[22px]">
                  Quand ça ouvre&nbsp;?
                </dt>
                <dd className="text-[17px] md:text-[19px] leading-relaxed opacity-80">
                  Printemps 2026. Vous recevrez un seul message, le jour de
                  l'ouverture.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="divider-rule" />
        </div>

        <footer className="px-6 md:px-10 py-12 md:py-16">
          <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <p className="h-display text-[20px]">Tata Lali</p>
              <p className="text-[14px] opacity-60 max-w-[420px] leading-relaxed">
                Édité avec soin en France. Sous supervision humaine. Aucune
                vidéo, aucune notification, aucune urgence inventée.
              </p>
            </div>
            <p className="caption opacity-60">
              © 2026 Tata Lali · tatalali.com
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
