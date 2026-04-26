import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/i18n/config";
import { db, lessons } from "@/db";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getLesson(locale: Locale, n: number) {
  try {
    const rows = await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.locale, locale), eq(lessons.number, n)))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; n: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, n: rawN } = await params;
  if (!isValidLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const n = Number.parseInt(rawN, 10);
  if (!Number.isFinite(n)) return {};
  const lesson = await getLesson(locale, n);
  if (!lesson) return {};
  return {
    title: `Leçon ${lesson.number} · ${lesson.title}`,
    description: lesson.hook ?? undefined,
  };
}

function renderMarkdown(md: string) {
  // Minimal markdown: paragraphs, **bold**, line breaks. No deps.
  const blocks = md.split(/\n\s*\n/);
  return blocks.map((block, i) => {
    const html = block
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
    return (
      <p
        key={i}
        className="mb-5 leading-relaxed text-stone-800"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export default async function LeconPage({
  params,
}: {
  params: Promise<{ locale: string; n: string }>;
}) {
  const { locale: rawLocale, n: rawN } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const n = Number.parseInt(rawN, 10);
  if (!Number.isFinite(n) || n < 1 || n > 30) notFound();

  const lesson = await getLesson(locale, n);
  if (!lesson) notFound();

  // Gate : only published or preview lessons are shown publicly.
  const visible = lesson.isPreview === 1 || lesson.status === "published";
  if (!visible) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16 print:py-4">
      <nav className="mb-8 text-sm text-stone-500 print:hidden">
        <Link href={`/${locale}/lecons`} className="hover:text-stone-900">
          ← Toutes les leçons
        </Link>
      </nav>

      <header className="mb-8">
        <p className="text-sm uppercase tracking-widest text-stone-500">
          Leçon {lesson.number}
          {lesson.chapter ? <> · Chapitre {lesson.chapter}</> : null}
        </p>
        <h1 className="mt-3 font-serif text-3xl text-stone-900 md:text-4xl">{lesson.title}</h1>
        {lesson.hook ? (
          <p className="mt-4 italic text-stone-600">{lesson.hook}</p>
        ) : null}
      </header>

      <article className="font-serif text-lg">{renderMarkdown(lesson.bodyMd)}</article>

      {lesson.exercise ? (
        <section className="mt-10 border-t border-stone-200 pt-6">
          <h2 className="mb-3 font-serif text-xl text-stone-900">À essayer ce soir</h2>
          <p className="leading-relaxed text-stone-700">{lesson.exercise}</p>
        </section>
      ) : null}

      {lesson.teaser ? (
        <p className="mt-8 italic text-stone-500">{lesson.teaser}</p>
      ) : null}

      <footer className="mt-16 flex items-center justify-between text-sm print:hidden">
        <button
          type="button"
          className="rounded-full border border-stone-300 px-4 py-2 hover:bg-stone-100"
          onClick={undefined}
          disabled
          title="Bientôt disponible"
        >
          Imprimer / PDF
        </button>
        <Link
          href={`/${locale}#reserver`}
          className="rounded-full bg-stone-900 px-5 py-2 text-white hover:bg-stone-700"
        >
          Réserver tout le manuel — 2€
        </Link>
      </footer>
    </main>
  );
}
