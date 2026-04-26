/**
 * Génère les leçons V2 (format strict didactique 7 blocs, 120-150 mots).
 * Source du brief : Nano/tata-lali/PLAN-PEDAGOGIQUE-V2.md
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

const SYSTEM_PROMPT = `Tu es Tata Lali, autrice d'un manuel pédagogique pour des Français de 45-65 ans qui découvrent l'IA. Format strict notice IKEA, 90 secondes de lecture, 120-150 mots.

PRINCIPES ANDRAGOGIQUES (à respecter en pensée, pas à expliciter) :
- Adulte apprend en faisant, pas en lisant
- Adulte a besoin de savoir À QUOI ÇA SERT avant d'apprendre
- Adulte a besoin de réussir VITE pour rester engagé
- Adulte a besoin de réactivation pour mémoriser

INTERDITS ABSOLUS :
- Aucun em dash (—) JAMAIS. Marqueur d'IA générique. Utiliser virgule, parenthèses, point.
- Pas de jargon ("framework", "scaffold", "pattern", "delve into", "in conclusion")
- Pas de hype ("magique", "incroyable", "révolutionnaire", "bluffant", "ouf")
- Pas de "ne vous inquiétez pas" (sous-entend qu'on devrait s'inquiéter)
- Pas de prose littéraire ni d'anecdote longue
- Pas de référence culturelle qui exclut (Bourdieu, Tarantino, Silicon Valley)
- Pas de tutoiement. Vouvoiement systématique.
- Pas de listes à puces dans les blocs textuels (sauf bloc 4 ÉTAPES qui est numéroté)

STRUCTURE OBLIGATOIRE (7 blocs, dans cet ordre exact, séparés par lignes blanches) :

# Leçon N — [Titre exact]

**[HOOK 3-5 mots]**

[BLOC 2 — OBJECTIF] Une phrase. Commence OBLIGATOIREMENT par "À la fin de cette leçon, vous saurez". Max 22 mots.

[BLOC 3 — CONCEPT-CLÉ] 1 à 2 phrases max. La règle, le principe. Max 40 mots.

## Étape par étape

1. [verbe à l'impératif, action atomique]
2. [verbe à l'impératif, action atomique]
3. [verbe à l'impératif, action atomique]
(3 à 5 étapes max, 1 ligne chacune)

## Tape ça maintenant

> "[prompt à copier-coller, entre guillemets]"

*Résultat attendu : [1 phrase qui décrit ce que Catherine doit voir/avoir]*

## Vérifiez

[1 question binaire]

- **Oui** → [phrase de validation, 1 ligne]
- **Pas tout à fait** → [1 conseil de relance, 1 ligne]

---

**Bravo !** [phrase de récompense, 1 ligne]
**Demain :** [teaser concret, 1 ligne]

LONGUEUR TOTALE : 120-150 mots cible, 220 max. Si tu dépasses, COUPE.

TON :
- Direct, chaleureux, lucide
- Vouvoiement systématique
- Verbe à l'impératif dans les étapes
- Pas de condescendance. Catherine est intelligente, juste novice.
- Le hook (3-5 mots) doit évoquer une situation reconnaissable de Catherine.

Tu écris en français.`;

type Outline = (typeof OUTLINE)[number];

async function generateLesson(client: Anthropic, outline: Outline): Promise<{ bodyMd: string; hook: string; exercise: string; teaser: string }> {
  const userPrompt = `Écris la Leçon ${outline.lessonNumber} : "${outline.title}" (Phase ${outline.phase} ${outline.phaseName}).

Objectif d'apprentissage à atteindre : ${outline.objective}
Concept-clé à transmettre : ${outline.conceptKey}
Exercice testable visé : ${outline.exercise}
Résultat attendu : ${outline.expectedResult}

Suis EXACTEMENT la structure imposée par le system prompt (7 blocs). Renvoie UNIQUEMENT le markdown complet de la leçon, sans préambule, sans commentaire.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { text: string }).text)
    .join("\n");

  // Sanity check : reject em dashes (Tata Lali rule)
  if (text.includes("—")) {
    throw new Error(`Lesson #${outline.lessonNumber} contains em dash. Tata Lali rule violated. Retry needed.`);
  }

  // Sanity check : word count
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 250) {
    throw new Error(`Lesson #${outline.lessonNumber} too long (${wordCount} words, max 250).`);
  }

  // Extract hook (line starting with **)
  const hookMatch = text.match(/\*\*([^*\n]{3,40})\*\*/);
  const hook = hookMatch ? hookMatch[1].trim() : outline.title;

  // Extract teaser (line after "**Demain :**" or end)
  const teaserMatch = text.match(/\*\*Demain\s*:\*\*\s*(.+)$/m);
  const teaser = teaserMatch ? teaserMatch[1].trim() : "";

  // Extract exercise (block under "## Tape ça maintenant")
  const exerciseMatch = text.match(/##\s*Tape ça maintenant\s*\n+([\s\S]*?)(?=\n## |\n---|$)/);
  const exercise = exerciseMatch ? exerciseMatch[1].trim() : outline.exercise;

  return { bodyMd: text, hook, exercise, teaser };
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

function phaseToChapter(phase: number): number {
  return phase; // direct mapping for V2
}

async function main() {
  const args = process.argv.slice(2);
  const fromIdx = args.indexOf("--from");
  const toIdx = args.indexOf("--to");
  const localeIdx = args.indexOf("--locale");
  const from = fromIdx >= 0 ? Number.parseInt(args[fromIdx + 1], 10) : 1;
  const to = toIdx >= 0 ? Number.parseInt(args[toIdx + 1], 10) : 30;
  const locale = localeIdx >= 0 ? args[localeIdx + 1] : "fr";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY missing");
  const client = new Anthropic({ apiKey });

  const targets = OUTLINE.filter((o) => o.lessonNumber >= from && o.lessonNumber <= to);
  console.log(`[generate-lessons V2] generating ${targets.length} lessons (${from}..${to}, locale=${locale}, model=${MODEL})`);

  for (const outline of targets) {
    const existing = await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.number, outline.lessonNumber), eq(lessons.locale, locale)))
      .limit(1);

    if (existing.length > 0 && existing[0].generatedBy === "human" && existing[0].status === "published") {
      console.log(`[generate-lessons V2] #${outline.lessonNumber} is human-published, skipping`);
      continue;
    }

    console.log(`[generate-lessons V2] generating #${outline.lessonNumber}: ${outline.title}`);
    let attempt = 0;
    let result: Awaited<ReturnType<typeof generateLesson>> | null = null;
    while (attempt < 3 && !result) {
      attempt++;
      try {
        result = await generateLesson(client, outline);
      } catch (err) {
        console.warn(`[generate-lessons V2] attempt ${attempt} failed for #${outline.lessonNumber}:`, (err as Error).message);
        if (attempt >= 3) throw err;
      }
    }
    if (!result) throw new Error(`Failed to generate #${outline.lessonNumber}`);

    const payload = {
      number: outline.lessonNumber,
      locale,
      chapter: phaseToChapter(outline.phase),
      slug: slugify(outline.title),
      title: outline.title,
      hook: result.hook,
      bodyMd: result.bodyMd,
      exercise: result.exercise,
      teaser: result.teaser || null,
      status: "review" as const,
      generatedBy: "claude" as const,
      isPreview: outline.lessonNumber === 1 ? 1 : 0, // L1 = démo gratuite publique
    };

    if (existing.length > 0) {
      await db
        .update(lessons)
        .set({ ...payload, updatedAt: new Date() })
        .where(and(eq(lessons.number, outline.lessonNumber), eq(lessons.locale, locale)));
    } else {
      await db.insert(lessons).values(payload);
    }
    console.log(`[generate-lessons V2] #${outline.lessonNumber} stored (status=review, ${result.bodyMd.split(/\s+/).length} words)`);
  }

  console.log("[generate-lessons V2] done. All lessons in status=review awaiting Jérémie's validation.");
}

main().catch((err) => {
  console.error("[generate-lessons V2] fatal", err);
  process.exit(1);
});
