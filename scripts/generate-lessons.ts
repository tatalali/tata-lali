/**
 * Génère les leçons restantes (5..30 en FR) avec Claude API.
 * Utilise le programme dans data/programme-30-lecons.ts comme outline.
 *
 * Usage : npx tsx scripts/generate-lessons.ts [--from N] [--to M] [--locale fr]
 * Requiert : ANTHROPIC_API_KEY + DATABASE_URL en env
 */

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { db, lessons } from "../db";
import { eq, and } from "drizzle-orm";
import { OUTLINE } from "../data/programme-30-lecons";

const MODEL = "claude-sonnet-4-5-20250929";

const SYSTEM_PROMPT = `Tu es Tata Lali, l'autrice d'un manuel pédagogique de 30 leçons pour faire découvrir l'IA aux Français de 45-65 ans. Voici tes règles ABSOLUES :

TON :
- Chaleureux, désacralisé, sans jargon
- Vouvoiement direct mais affectueux ("vous", "votre")
- Métaphores du quotidien : téléphone, frigo, beau-frère, médecin, mail au syndic
- Pas de hype ("révolutionnaire", "incroyable", "fascinant")
- Pas de panique ("dangereux", "remplacement")
- Honnêteté radicale sur les limites de l'IA

INTERDITS ABSOLUS :
- Aucun em dash (—) dans le texte. JAMAIS. C'est un marqueur d'IA générique. Utiliser ":", ".", "(...)" ou retravailler la phrase.
- Pas d'anglicismes ("smart", "AI-powered", "next-gen", "delve into", "in conclusion")
- Pas de listes à puces dans le corps (sauf cas exceptionnel)
- Pas de "Imaginez que...", "Voici le secret...", "Vous savez quoi ?"
- Pas de promesses miracle

STRUCTURE EXACTE (à respecter à la lettre) :

# Leçon N — [Titre du programme]

[1 anecdote concrète d'ouverture, 2-3 phrases, ancrée dans la vie d'un Français de 55 ans]

[Corps de la leçon, 280-380 mots, paragraphes courts, métaphores du quotidien, prend le lecteur par la main]

## À essayer ce soir

[Un exercice concret, faisable en moins de 5 minutes, avec des outils gratuits accessibles. Précis : où aller, quoi taper, quoi comparer.]

[Teaser pour la leçon suivante : 1-2 phrases qui donnent envie sans spoiler.]

LONGUEUR TOTALE : 350-450 mots maximum. Compte les mots. Si tu dépasses, coupe.

Tu écris en français. Le ton est celui d'une tante chaleureuse, lucide, qui prend le temps d'expliquer sans condescendance.`;

type Outline = {
  lessonNumber: number;
  chapter: number;
  title: string;
  hook: string;
  exercise: string;
};

async function generateLesson(client: Anthropic, outline: Outline): Promise<{ bodyMd: string; exercise: string; teaser: string }> {
  const userPrompt = `Écris la Leçon ${outline.lessonNumber} : "${outline.title}" (Chapitre ${outline.chapter}).

Hook à utiliser : "${outline.hook}"
Exercice cible : "${outline.exercise}"

Suis EXACTEMENT la structure imposée par le system prompt. Renvoie UNIQUEMENT le markdown complet de la leçon, sans préambule, sans commentaire.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { text: string }).text)
    .join("\n");

  // Sanity check : reject em dashes
  if (text.includes("—")) {
    throw new Error(`Lesson #${outline.lessonNumber} contains em dash — Tata Lali rule violated. Retry needed.`);
  }

  // Parse out body / exercise / teaser
  const exerciseSplit = text.split(/##\s*À essayer ce soir/i);
  if (exerciseSplit.length < 2) {
    throw new Error(`Lesson #${outline.lessonNumber} missing "À essayer ce soir" section.`);
  }
  const bodyMd = exerciseSplit[0].replace(/^#\s+.*\n/, "").trim();
  const rest = exerciseSplit[1].trim();

  // Last paragraph = teaser, rest = exercise
  const lines = rest.split(/\n\s*\n/);
  const teaser = lines.length > 1 ? lines[lines.length - 1].trim() : "";
  const exercise = lines.slice(0, lines.length > 1 ? -1 : undefined).join("\n\n").trim();

  return { bodyMd, exercise, teaser };
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

async function main() {
  const args = process.argv.slice(2);
  const fromIdx = args.indexOf("--from");
  const toIdx = args.indexOf("--to");
  const localeIdx = args.indexOf("--locale");
  const from = fromIdx >= 0 ? Number.parseInt(args[fromIdx + 1], 10) : 5;
  const to = toIdx >= 0 ? Number.parseInt(args[toIdx + 1], 10) : 30;
  const locale = localeIdx >= 0 ? args[localeIdx + 1] : "fr";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY missing");
  const client = new Anthropic({ apiKey });

  const targets = OUTLINE.filter((o) => o.lessonNumber >= from && o.lessonNumber <= to);
  console.log(`[generate-lessons] generating ${targets.length} lessons (${from}..${to}, locale=${locale})`);

  for (const outline of targets) {
    const existing = await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.number, outline.lessonNumber), eq(lessons.locale, locale)))
      .limit(1);

    if (existing.length > 0 && existing[0].generatedBy === "human") {
      console.log(`[generate-lessons] #${outline.lessonNumber} is human-written, skipping`);
      continue;
    }

    console.log(`[generate-lessons] generating #${outline.lessonNumber}: ${outline.title}`);
    let attempt = 0;
    let result: { bodyMd: string; exercise: string; teaser: string } | null = null;
    while (attempt < 3 && !result) {
      attempt++;
      try {
        result = await generateLesson(client, outline);
      } catch (err) {
        console.warn(`[generate-lessons] attempt ${attempt} failed for #${outline.lessonNumber}:`, (err as Error).message);
        if (attempt >= 3) throw err;
      }
    }
    if (!result) throw new Error(`Failed to generate #${outline.lessonNumber}`);

    const payload = {
      number: outline.lessonNumber,
      locale,
      chapter: outline.chapter,
      slug: slugify(outline.title),
      title: outline.title,
      hook: outline.hook,
      bodyMd: result.bodyMd,
      exercise: result.exercise,
      teaser: result.teaser || null,
      status: "review" as const,
      generatedBy: "claude" as const,
    };

    if (existing.length > 0) {
      await db
        .update(lessons)
        .set({ ...payload, updatedAt: new Date() })
        .where(and(eq(lessons.number, outline.lessonNumber), eq(lessons.locale, locale)));
    } else {
      await db.insert(lessons).values(payload);
    }
    console.log(`[generate-lessons] #${outline.lessonNumber} stored (status=review)`);
  }

  console.log("[generate-lessons] done");
}

main().catch((err) => {
  console.error("[generate-lessons] fatal", err);
  process.exit(1);
});
