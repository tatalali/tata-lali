/**
 * Seed les 3 leçons FR existantes (extraites de mon-cerveau/Nano/tata-lali/lecons/).
 *
 * Usage : npx tsx scripts/seed-lessons.ts
 * Requiert : DATABASE_URL en env
 */

import "dotenv/config";
import { db, lessons } from "../db";
import { eq, and } from "drizzle-orm";

const SEEDS = [
  {
    number: 1,
    locale: "fr",
    chapter: 1,
    slug: "lia-ce-nest-pas-magique",
    title: "L'IA, ce n'est pas magique",
    hook: "Votre téléphone qui devine le mot suivant, c'est déjà une IA.",
    bodyMd: `Vous tapez "merci docteur" sur votre téléphone. Avant que vous ayez fini, le mot suivant apparaît tout seul. Votre téléphone a deviné. Pas parce qu'il vous connaît : parce qu'il a vu des millions de fois que "merci" est souvent suivi de "docteur" dans un certain contexte.

Voilà. Vous savez désormais ce qu'est une intelligence artificielle.

Plus exactement : vous savez ce que fait un grand modèle de langage, comme ChatGPT ou Claude. C'est un correcteur orthographique géant, qui devine non pas le mot suivant, mais la phrase suivante, le paragraphe suivant, parfois le texte entier. Pour faire cela, il a digéré des milliards de pages : romans, articles de presse, manuels, recettes, courriers, code informatique. Il en a tiré des régularités. Quand vous lui posez une question, il ne va pas chercher la réponse dans une base de données. Il prédit, mot après mot, ce qu'un texte plausible répondrait à votre question.

C'est étonnant. Ce n'est pas magique.

Le mot "intelligence" est trompeur. La machine ne pense pas. Elle ne comprend pas. Elle imite, à partir d'une connaissance statistique gigantesque de la langue. Cela suffit à produire des textes utiles, parfois étonnants, parfois drôles, parfois faux. Cela ne suffit pas à remplacer un médecin, un juge, un professeur. Cela peut, en revanche, vous aider à écrire un mail, à comprendre un document, à organiser un voyage, à expliquer un mot à un petit-enfant.

Pourquoi tout ce vacarme, alors ? Parce que jusqu'à 2022, ces machines étaient encore maladroites. Vous tapiez quelque chose, elles répondaient à côté. Et puis, en novembre 2022, ChatGPT est arrivé. La conversation est devenue fluide. Le contenu est devenu utile. Le grand public a découvert ce que les chercheurs voyaient venir depuis des années : un outil qui sait manier la langue comme un humain.

À partir de là, deux camps. Les enthousiastes, qui voient un nouveau monde. Les inquiets, qui voient un risque. Vous n'êtes obligé d'appartenir à aucun des deux. Vous avez le droit de vous renseigner d'abord.

C'est ce que ce manuel vous propose. Trente leçons, une par jour. Sans jargon. Sans hype. Sans panique. Juste assez pour que vous puissiez décider, vous-même, ce que cette technologie vaut pour votre vie.`,
    exercise: `Ouvrez n'importe quel chatbot (chatgpt.com, claude.ai). Tapez : "Explique-moi en trois phrases comment tu fonctionnes". Lisez la réponse. Demandez ensuite : "Et qu'est-ce que tu ne peux PAS faire ?". Cela suffira pour la première soirée.`,
    teaser: `Demain, on parlera d'où viennent ces machines. Sans physique quantique. Promis.`,
    status: "published",
    generatedBy: "human",
  },
  {
    number: 2,
    locale: "fr",
    chapter: 1,
    slug: "dou-viennent-ces-machines",
    title: "D'où viennent ces machines ?",
    hook: `Alan Turing, 1950 : "Les machines peuvent-elles penser ?"`,
    bodyMd: `En 1950, un mathématicien britannique nommé Alan Turing pose une question dans un article scientifique. Elle tient en six mots : "Les machines peuvent-elles penser ?"

Il ne savait pas encore que cette question agiterait le monde entier soixante-dix ans plus tard.

Turing avait construit, pendant la Seconde Guerre mondiale, une machine capable de décrypter les codes secrets des nazis. Il n'appelait pas ça "intelligence artificielle". Il appelait ça du calcul. Mais il avait compris une chose fondamentale : si une machine peut imiter suffisamment bien le comportement humain, la question de savoir si elle "pense vraiment" devient secondaire.

Les décennies suivantes sont une longue succession de promesses et de déceptions. Dans les années 60, des chercheurs américains annoncent que les machines vont bientôt parler comme des humains. Dans les années 70, les financements s'effondrent. Les années 80 relancent l'enthousiasme, les années 90 le refroidissent à nouveau. C'est ce que les spécialistes appellent les "hivers de l'IA" : des périodes où la technologie ne tient pas ses promesses, les laboratoires se vident, et le grand public oublie.

Puis internet arrive. Des centaines de millions de personnes commencent à écrire, sur des forums, des blogs, des réseaux sociaux, des sites de recettes, des commentaires de films. Sans le savoir, elles fabriquent l'ingrédient manquant : des données en quantité astronomique. Des textes. Des millions de livres numérisés. Des dizaines d'années d'articles de presse. Des conversations, des mails, des blagues, des lettres.

Dans les années 2010, de nouveaux algorithmes apprennent à lire tout ça. Les résultats sont d'abord modestes. Puis, en 2017, une équipe chez Google publie un article technique dont le titre est sobre : "Attention is All You Need". Ce titre ne vous dira rien. Ce qu'il décrit, oui : une architecture qui permet à une machine d'apprendre à lire un texte en entier, à comprendre les relations entre les mots, à prédire ce qui vient ensuite avec une précision jamais atteinte. On appelle ça un "transformeur".

En novembre 2022, OpenAI rend ChatGPT accessible à tout le monde. En cinq jours, un million d'utilisateurs. En deux mois, cent millions. Jamais dans l'histoire d'internet une application n'avait grossi aussi vite.

Vous n'étiez pas en retard. L'accélération a été brutale pour tout le monde.`,
    exercise: `Tapez dans n'importe quel chatbot : "Explique-moi ce qu'est un 'transformeur' en intelligence artificielle, comme si j'avais 55 ans et aucune formation technique." Lisez la réponse. Si elle est trop compliquée, répondez : "Encore plus simple." Recommencez jusqu'à ce que vous compreniez.`,
    teaser: `Demain : ChatGPT, Claude, Gemini. Qui est qui, et pourquoi ça change quelque chose.`,
    status: "published",
    generatedBy: "human",
  },
  {
    number: 3,
    locale: "fr",
    chapter: 1,
    slug: "chatgpt-claude-gemini",
    title: "ChatGPT, Claude, Gemini : qui est qui",
    hook: "OpenAI, Anthropic, Google : 3 entreprises, 3 cultures, 3 produits.",
    bodyMd: `Il y a trois grandes entreprises dans cette histoire. Pas plus. Pas moins. Et comprendre qui elles sont vous aidera à choisir l'outil qui vous convient, ou au moins à ne plus confondre les noms quand on les cite à la télévision.

**OpenAI** est l'entreprise qui a lancé ChatGPT. Elle a été fondée à San Francisco en 2015 par plusieurs personnes, dont un certain Elon Musk, qui en est parti depuis. Aujourd'hui, c'est Sam Altman qui la dirige. OpenAI est partiellement financée par Microsoft, ce qui explique que certaines fonctions de ChatGPT se retrouvent dans les outils Microsoft (Word, Outlook). ChatGPT est leur produit grand public. Les abonnés payants accèdent à des versions plus puissantes. C'est l'outil le plus connu, le plus utilisé, et celui dont tout le monde parle quand on dit "l'IA".

**Anthropic** est l'entreprise qui a créé Claude, le chatbot avec lequel vous avez peut-être déjà interagi si vous venez de France. Anthropic a été fondée par des anciens d'OpenAI qui voulaient une approche plus prudente, plus axée sur la sécurité. C'est une entreprise plus petite, moins connue du grand public, mais souvent citée par les experts comme un acteur sérieux. Claude est parfois considéré comme plus précis et plus honnête que ChatGPT sur ses limites.

**Google** est le géant historique des moteurs de recherche, et il n'a pas l'intention de se laisser distancer. Son produit grand public s'appelle Gemini. Google a un avantage énorme : il possède YouTube, Gmail, Google Maps, des décennies de données. Il a aussi un avantage en termes de recherche : ses laboratoires sont parmi les plus importants du monde. Ce qui ne l'a pas empêché de faire une présentation catastrophique de Gemini en 2023, avec des erreurs factuelles visibles en direct. Depuis, ils ont rattrapé leur retard.

Ces trois-là ne sont pas seuls. Meta (la maison mère de Facebook et Instagram) développe ses propres modèles, appelés Llama, disponibles gratuitement pour les développeurs. La France a EuroLLM et Mistral AI, une startup parisienne considérée comme le meilleur espoir européen. Et des dizaines d'autres existent.

Mais pour vous, en pratique, ce sont ces trois produits qui comptent : ChatGPT, Claude, Gemini. Ils sont tous accessibles gratuitement sur navigateur ou téléphone. Ils font tous peu ou prou la même chose : répondre à vos questions, vous aider à écrire, résumer un texte, expliquer un concept. Leurs différences sont réelles mais subtiles, et souvent secondaires par rapport à la question : est-ce que je sais bien leur parler ?

C'est justement ce que nous allons apprendre ensemble.`,
    exercise: `Ouvrez les trois : chatgpt.com (compte gratuit), claude.ai (compte gratuit), gemini.google.com (compte Google obligatoire). Posez-leur la même question : "Quel est le principal danger de l'intelligence artificielle selon vous ?" Comparez les trois réponses. Observez les différences de ton, de longueur, de mise en garde.`,
    teaser: `Demain : pourquoi 2022 a tout changé, et pourquoi ce n'est pas fini.`,
    status: "published",
    generatedBy: "human",
  },
  {
    number: 4,
    locale: "fr",
    chapter: 1,
    slug: "pourquoi-tout-le-monde-en-parle",
    title: "Pourquoi tout le monde en parle MAINTENANT",
    hook: "Avant 2022, on causait à un robot. Après 2022, on cause à quelque chose qui répond.",
    bodyMd: `Si vous avez essayé Siri sur votre iPhone en 2018, vous savez ce qu'on appelait alors un assistant. Vous demandiez la météo, ça marchait. Vous demandiez de prévenir Marie que vous seriez en retard, ça envoyait souvent le message à Mathieu. Vous tentiez une conversation, ça vous proposait de chercher sur le web. C'était utile pour trois choses, frustrant pour cent autres.

Et puis novembre 2022, ChatGPT sort. Vous tapez : "J'ai 58 ans, je dois écrire un mot de condoléances à la fille d'un collègue, je n'ai jamais su trouver les mots. Aide-moi." Et la machine vous répond. Pas avec un lien. Pas avec une suggestion. Avec un texte. Bien tourné. Adapté. Chaleureux. Vous le retravaillez un peu, vous l'envoyez. Marie, dans son chagrin, ne saura jamais qu'une machine a tenu votre stylo. Elle saura juste qu'on a pensé à elle.

C'est ça qui a changé. Pas une nouvelle invention. Un saut de qualité.

Pour comprendre ce saut, imaginez l'histoire suivante. Pendant des décennies, des chercheurs essaient d'apprendre à des machines à parler une langue. Ils leur donnent des règles de grammaire, des dictionnaires, des listes d'exceptions. Les machines apprennent par cœur, mais ne comprennent rien. Elles produisent des phrases correctes mais creuses, comme un élève qui récite sans saisir.

Puis quelqu'un a une idée différente : et si, au lieu d'enseigner les règles, on faisait simplement lire à la machine *tout ce qui a été écrit* ? Tous les livres, tous les articles, tous les forums. Des milliards de pages. La machine ne mémorise pas le contenu. Elle absorbe les patterns : comment les phrases s'enchaînent, comment on console, comment on argumente, comment on plaisante. Quand vous lui parlez, elle compose à partir de ces patterns.

Le résultat ressemble à de la pensée. Ce n'en est pas. Mais à l'usage, la différence devient parfois invisible. Et c'est précisément ça qui nous fait peur, qui nous fascine, qui remplit les journaux depuis trois ans.

Vous n'êtes pas en retard. Vous êtes au moment où il fallait arriver : après les bugs des premières heures, avant que ça ne devienne banal.`,
    exercise: `Pensez à la dernière question que vous avez tapée sur Google. N'importe laquelle. Tapez-la cette fois sur ChatGPT ou Claude. Comparez les deux réponses : Google vous donne dix liens à parcourir. ChatGPT vous donne une réponse écrite. Demandez-vous : laquelle vous fait gagner du temps ?`,
    teaser: `Demain, on regarde ce que ces machines peuvent faire concrètement, jour après jour. Pas en théorie. Dans votre cuisine, votre boîte mail, votre vie.`,
    status: "published",
    generatedBy: "claude",
  },
];

async function main() {
  console.log(`[seed-lessons] starting with ${SEEDS.length} lessons`);

  for (const seed of SEEDS) {
    const existing = await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.number, seed.number), eq(lessons.locale, seed.locale)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(lessons)
        .set({
          ...seed,
          updatedAt: new Date(),
        })
        .where(and(eq(lessons.number, seed.number), eq(lessons.locale, seed.locale)));
      console.log(`[seed-lessons] updated #${seed.number} (${seed.locale})`);
    } else {
      await db.insert(lessons).values(seed);
      console.log(`[seed-lessons] inserted #${seed.number} (${seed.locale})`);
    }
  }

  console.log("[seed-lessons] done");
}

main().catch((err) => {
  console.error("[seed-lessons] fatal", err);
  process.exit(1);
});
