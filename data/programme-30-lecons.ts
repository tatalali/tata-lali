/**
 * Outline des 30 leçons du manuel Tata Lali.
 * Source de vérité utilisée par scripts/generate-lessons.ts.
 *
 * Structure : 4 chapitres (Comprendre / Essayer / Discerner / Vivre avec).
 */

export type LessonOutline = {
  lessonNumber: number;
  chapter: number;
  title: string;
  hook: string;
  exercise: string;
};

export const OUTLINE: LessonOutline[] = [
  // Chapitre 1 — Comprendre (1-10)
  {
    lessonNumber: 1,
    chapter: 1,
    title: "L'IA, ce n'est pas magique",
    hook: "Votre téléphone qui devine le mot suivant, c'est déjà une IA.",
    exercise: "Demander à un chatbot : explique-moi comment tu fonctionnes en 3 phrases.",
  },
  {
    lessonNumber: 2,
    chapter: 1,
    title: "D'où viennent ces machines ?",
    hook: 'Alan Turing, 1950 : "Les machines peuvent-elles penser ?"',
    exercise: "Aller voir la page Wikipedia ChatGPT et lire le premier paragraphe.",
  },
  {
    lessonNumber: 3,
    chapter: 1,
    title: "ChatGPT, Claude, Gemini : qui est qui",
    hook: "OpenAI, Anthropic, Google : 3 entreprises, 3 cultures, 3 produits.",
    exercise: "Ouvrir un compte gratuit chez l'un des 3 et lui dire bonjour.",
  },
  {
    lessonNumber: 4,
    chapter: 1,
    title: "Pourquoi tout le monde en parle MAINTENANT",
    hook: "Avant 2022, on causait à un robot. Après 2022, on cause à quelque chose qui répond.",
    exercise: "Poser à un chatbot une question récemment tapée sur Google. Comparer.",
  },
  {
    lessonNumber: 5,
    chapter: 1,
    title: "Que peut-elle faire (vraiment) ?",
    hook: "Elle est meilleure que vous pour le brouillon, jamais pour la décision.",
    exercise: "Lui faire écrire un mail de remerciement à votre médecin.",
  },
  {
    lessonNumber: 6,
    chapter: 1,
    title: "Que ne peut-elle PAS faire ?",
    hook: "Elle invente parfois avec aplomb. Comme certains beaux-frères.",
    exercise: "Lui demander la météo du jour. Voir ce qu'elle répond.",
  },
  {
    lessonNumber: 7,
    chapter: 1,
    title: "La différence entre payant et gratuit",
    hook: "À 22€/mois, c'est moins cher que votre abonnement Canal+. Plus utile aussi peut-être.",
    exercise: "Essayer une question difficile sur la version gratuite, puis sur la version payante.",
  },
  {
    lessonNumber: 8,
    chapter: 1,
    title: "Vos données, où vont-elles ?",
    hook: "Ce que vous tapez peut servir à entraîner les futures versions, sauf si vous décochez la case.",
    exercise: "Aller dans les paramètres, trouver la case 'améliorer le modèle', la décocher.",
  },
  {
    lessonNumber: 9,
    chapter: 1,
    title: 'Faut-il apprendre à "prompter" ?',
    hook: "Savoir bien parler à une IA, c'est savoir bien parler tout court.",
    exercise: "Prendre une question floue, la rendre précise (50K€, retraite dans 7 ans, profil prudent).",
  },
  {
    lessonNumber: 10,
    chapter: 1,
    title: "Récapitulatif chapitre 1",
    hook: "Si vous avez compris ces 10 points, vous êtes au-dessus de 90% des Français.",
    exercise: "Expliquer en 3 phrases à un proche ce qu'est une IA. Sans jargon. Sans peur.",
  },
  // Chapitre 2 — Essayer (11-20)
  {
    lessonNumber: 11,
    chapter: 2,
    title: "Écrire un mail difficile",
    hook: "Ce mail au syndic dont vous repoussez l'écriture depuis 3 semaines.",
    exercise: "Faire écrire un brouillon de réclamation par l'IA, le retravailler à la main.",
  },
  {
    lessonNumber: 12,
    chapter: 2,
    title: "Comprendre un document administratif",
    hook: "Ce que votre conseiller fiscal vous dit en 30 secondes, l'IA vous l'explique en 3 lignes.",
    exercise: "Coller une page d'un document récent, demander un résumé en français simple.",
  },
  {
    lessonNumber: 13,
    chapter: 2,
    title: "Se faire expliquer un mot, un concept",
    hook: "La prochaine fois que vous lisez 'crypto-monnaie' dans le journal.",
    exercise: "Choisir un mot que vous ne maîtrisez pas, demander une explication adaptée à 50-65 ans.",
  },
  {
    lessonNumber: 14,
    chapter: 2,
    title: "Préparer un voyage",
    hook: "Le voyage de septembre en Croatie qu'on n'a pas encore commencé à organiser.",
    exercise: "Décrire votre prochain projet de voyage à l'IA, lui demander 3 idées.",
  },
  {
    lessonNumber: 15,
    chapter: 2,
    title: "Cuisiner avec ce qu'il y a dans le frigo",
    hook: "La fin du 'qu'est-ce qu'on mange ce soir ?'",
    exercise: "Ouvrir le frigo, lister 5 ingrédients, demander une recette pour ce soir.",
  },
  {
    lessonNumber: 16,
    chapter: 2,
    title: "Aider un petit-enfant pour ses devoirs",
    hook: "Ce dimanche où votre petit-fils vous montre son devoir d'histoire.",
    exercise: "Prendre un sujet de devoir d'un proche, demander à l'IA d'expliquer (sans donner la réponse).",
  },
  {
    lessonNumber: 17,
    chapter: 2,
    title: "Faire un résumé d'article ou de livre",
    hook: "Ce dossier de 12 pages dans Le Monde Diplo.",
    exercise: "Prendre un article web, demander un résumé en 5 points.",
  },
  {
    lessonNumber: 18,
    chapter: 2,
    title: "Traduire un texte",
    hook: "Cette pub en allemand sur l'emballage du café.",
    exercise: "Traduire un paragraphe d'un article étranger.",
  },
  {
    lessonNumber: 19,
    chapter: 2,
    title: "Brainstormer une idée",
    hook: "J'organise les 60 ans de ma sœur, donne-moi 10 idées de cadeaux.",
    exercise: "Choisir un projet en cours. Lui demander 10 idées.",
  },
  {
    lessonNumber: 20,
    chapter: 2,
    title: "Récapitulatif chapitre 2",
    hook: "Faire le bilan de ses 10 derniers jours.",
    exercise: "Noter les 3 usages qui vous ont le plus servi. Les autres, on oublie.",
  },
  // Chapitre 3 — Discerner (21-25)
  {
    lessonNumber: 21,
    chapter: 3,
    title: "Reconnaître quand l'IA invente",
    hook: "La fois où elle m'a inventé un livre qui n'existe pas.",
    exercise: "Lui demander une citation d'un auteur précis, vérifier sur Google.",
  },
  {
    lessonNumber: 22,
    chapter: 3,
    title: "Vérifier une information",
    hook: "Faites confiance, mais vérifiez.",
    exercise: "Poser une question chiffrée, demander la source, aller voir.",
  },
  {
    lessonNumber: 23,
    chapter: 3,
    title: "Repérer les biais",
    hook: "Elle dit souvent 'l'infirmière' au féminin et 'le médecin' au masculin.",
    exercise: "Tester. Parle-moi d'un PDG. Parle-moi d'un infirmier. Comparer.",
  },
  {
    lessonNumber: 24,
    chapter: 3,
    title: "Détecter un texte écrit par une IA",
    hook: "Ce mail commercial qui sonne bizarre.",
    exercise: "Sur un texte que vous lisez aujourd'hui, vous demander : humain ou IA ?",
  },
  {
    lessonNumber: 25,
    chapter: 3,
    title: "Quand NE PAS utiliser l'IA",
    hook: "Votre médecin coûte 30€, votre santé n'en a pas de prix.",
    exercise: "Lister 3 décisions où vous NE feriez PAS confiance à l'IA. Garder cette liste.",
  },
  // Chapitre 4 — Vivre avec (26-30)
  {
    lessonNumber: 26,
    chapter: 4,
    title: "L'IA et le travail (le vôtre, celui de vos proches)",
    hook: "Si votre métier consiste à brasser du texte, l'IA va le rebrasser plus vite.",
    exercise: "Demander : comment changer mon métier de [X] dans les 5 prochaines années.",
  },
  {
    lessonNumber: 27,
    chapter: 4,
    title: "L'IA et les enfants/petits-enfants",
    hook: "Les ados utilisent ChatGPT pour leurs devoirs. Comme nous utilisions la calculatrice.",
    exercise: "Demander à un ado de votre entourage de vous montrer comment IL utilise l'IA.",
  },
  {
    lessonNumber: 28,
    chapter: 4,
    title: "L'IA et le débat public",
    hook: "Il y a deux paniques : celle des gens qui n'utilisent pas l'IA, et celle de ceux qui l'utilisent.",
    exercise: "Lire un article récent sur 'les dangers de l'IA'. Le faire résumer par l'IA. Comparer.",
  },
  {
    lessonNumber: 29,
    chapter: 4,
    title: "L'IA et l'argent : qui s'enrichit ?",
    hook: "Nvidia vaut plus cher que toutes les entreprises du CAC 40 réunies.",
    exercise: "Aller voir le cours de bourse de Nvidia ces 2 dernières années.",
  },
  {
    lessonNumber: 30,
    chapter: 4,
    title: "Et après ?",
    hook: "Vous savez maintenant ce qu'est l'IA. La prochaine étape, c'est vivre avec.",
    exercise: "Choisir UNE des 3 ressources recommandées. La consulter cette semaine.",
  },
];
