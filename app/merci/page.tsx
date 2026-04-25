import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merci — Tata Lali",
  description: "Votre pré-réservation est confirmée. À bientôt.",
  robots: { index: false, follow: false },
};

export default function Merci() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 md:px-10 py-32">
      <div className="max-w-[640px] mx-auto text-center space-y-8">
        <span className="tag-band mb-2">Confirmé</span>
        <h1 className="h-display text-[44px] md:text-[64px] leading-[1.05]">
          Merci.<br />C'est noté.
        </h1>
        <div className="space-y-4 text-[17px] md:text-[19px] leading-relaxed opacity-80">
          <p>
            Votre pré-réservation est enregistrée. Vous recevrez la première
            leçon le jour de l'ouverture, au printemps 2026.
          </p>
          <p>
            Aucun mail intermédiaire. Pas de newsletter. Juste les 30 leçons,
            une par jour, à votre rythme.
          </p>
          <p className="opacity-70">
            Un reçu Stripe arrive dans votre boîte mail dans la minute.
          </p>
        </div>
        <a href="/" className="caption underline">
          ← Retour à l'accueil
        </a>
      </div>
    </main>
  );
}
