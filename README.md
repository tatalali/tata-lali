# Tata Lali

> Apprendre l'IA, sans paniquer.

Un manuel illustré pour apprivoiser l'intelligence artificielle. Pour les
45-65 ans qui veulent comprendre, sans se faire avoir.

🌐 [tatalali.com](https://tatalali.com)

## Stack

- Next.js 16 · App Router · Turbopack
- React 19 · TypeScript
- Tailwind CSS v4
- Resend (e-mails de pré-inscription, fallback gracieux si non configuré)

## Développement local

```bash
npm install
npm run dev   # http://localhost:4328
```

## Variables d'environnement

| Nom              | Optionnel | Description                                |
| ---------------- | --------- | ------------------------------------------ |
| `RESEND_API_KEY` | oui       | Clé API Resend pour expédier les e-mails. Sans elle, les inscriptions sont enregistrées en console et l'utilisateur reçoit le message de succès. |
| `RESEND_FROM`    | oui       | Adresse expéditrice (ex. `Tata Lali <bonjour@tatalali.com>`). Défaut : aucun envoi. |

## Production

Déploiement sur Vercel — `tatalali.com`.
