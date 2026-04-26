import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/i18n/config";
import { db, lessons } from "@/db";
import { eq, asc } from "drizzle-orm";
import { OUTLINE } from "@/data/programme-30-lecons";

export const dynamic = "force-dynamic";

type ChapterMeta = { number: number; titleFr: string; descFr: string };

const CHAPTERS: Record<string, ChapterMeta[]> = {
  fr: [
    { number: 1, titleFr: "Comprendre", descFr: "10 leçons pour démystifier l'IA, sans jargon." },
    { number: 2, titleFr: "Essayer", descFr: "10 usages concrets dès demain matin." },
    { number: 3, titleFr: "Discerner", descFr: "5 leçons pour reconnaître ce qui est vrai, faux, douteux." },
    { number: 4, titleFr: "Vivre avec", descFr: "5 leçons pour faire sa place à l'IA dans la vie." },
  ],
};

export default async function LeconsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  let publishedNumbers = new Set<number>();
  try {
    const rows = await db
      .select({ number: lessons.number, isPreview: lessons.isPreview, status: lessons.status })
      .from(lessons)
      .where(eq(lessons.locale, locale))
      .orderBy(asc(lessons.number));
    publishedNumbers = new Set(
      rows.filter((r) => r.isPreview === 1 || r.status === "published").map((r) => r.number),
    );
  } catch {
    // DB not reachable in dev, fall through with empty set
  }

  const chapters = CHAPTERS[locale] ?? CHAPTERS.fr;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-widest text-stone-500">Le manuel</p>
        <h1 className="mt-3 font-serif text-4xl text-stone-900 md:text-5xl">
          30 leçons pour apprivoiser l&apos;IA
        </h1>
        <p className="mt-4 text-stone-600">
          Une par jour. 90 secondes. Sans jargon. Sans hype.
        </p>
      </div>

      <div className="space-y-12">
        {chapters.map((chap) => {
          const items = OUTLINE.filter((o) => o.chapter === chap.number);
          return (
            <section key={chap.number}>
              <header className="mb-4 border-b border-stone-200 pb-2">
                <h2 className="font-serif text-2xl text-stone-900">
                  Chapitre {chap.number} <span className="text-stone-400">·</span> {chap.titleFr}
                </h2>
                <p className="mt-1 text-sm text-stone-500">{chap.descFr}</p>
              </header>
              <ul className="divide-y divide-stone-100">
                {items.map((o) => {
                  const visible = publishedNumbers.has(o.lessonNumber);
                  const Inner = (
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <div className="flex items-baseline gap-3">
                        <span className="w-8 shrink-0 font-mono text-sm text-stone-400">
                          {String(o.lessonNumber).padStart(2, "0")}
                        </span>
                        <span className={visible ? "text-stone-900" : "text-stone-400"}>
                          {o.title}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 text-xs uppercase tracking-wider ${
                          visible ? "text-emerald-700" : "text-stone-400"
                        }`}
                      >
                        {visible ? "à lire" : "à venir"}
                      </span>
                    </div>
                  );
                  return (
                    <li key={o.lessonNumber}>
                      {visible ? (
                        <Link
                          href={`/${locale}/lecons/${o.lessonNumber}`}
                          className="block hover:bg-stone-50"
                        >
                          {Inner}
                        </Link>
                      ) : (
                        <div className="opacity-70">{Inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-16 rounded-2xl bg-stone-50 p-6 text-center">
        <p className="font-serif text-lg text-stone-900">
          Recevez une leçon par jour, dès le lancement.
        </p>
        <p className="mt-2 text-sm text-stone-600">
          Pré-réservation à 2€. Vous payez maintenant, vous recevez la première leçon au printemps 2026.
        </p>
        <Link
          href={`/${locale}#reserver`}
          className="mt-4 inline-block rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Réserver pour 2€
        </Link>
      </div>
    </main>
  );
}
