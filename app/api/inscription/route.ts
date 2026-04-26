import { NextRequest } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: { email?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const locale = typeof body.locale === "string" ? body.locale : "fr";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return Response.json({ error: "Email pas valide. Réessaie ?" }, { status: 400 });
  }

  // Persist to DB (non-blocking — never fail the user response)
  if (process.env.DATABASE_URL) {
    try {
      const { db, subscribers } = await import("@/db");
      await db
        .insert(subscribers)
        .values({ email, locale, source: "cta_subscribe", status: "subscribed" })
        .onConflictDoNothing();
    } catch (err) {
      console.error("[inscription] DB write failed", err);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM ?? "Tata Lali <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[inscription] RESEND_API_KEY manquante — capture seule.", { email });
    return Response.json({ ok: true, message: "C'est noté ! On t'écrit dès que c'est prêt." });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: "Bienvenue chez Tata Lali — c'est noté.",
        text: [
          "Salut,",
          "",
          "C'est Tata Lali. Ton inscription est bien enregistrée.",
          "",
          "Voilà ce qui se passe maintenant :",
          "— On finit de préparer les 30 leçons (90 secondes/jour).",
          "— On t'écrit le jour du lancement, avec la première leçon.",
          "— Pas de spam entre-temps. Promis.",
          "",
          "Si tu veux dire bonjour, tu peux répondre à ce mail.",
          "",
          "À très vite,",
          "Tata Lali",
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[inscription] Resend error", res.status, detail);
      return Response.json({ ok: true, message: "C'est noté ! On t'écrira au lancement." });
    }
  } catch (err) {
    console.error("[inscription] fetch Resend failed", err);
    return Response.json({ ok: true, message: "C'est noté ! On t'écrit au lancement." });
  }

  return Response.json({ ok: true, message: "Regarde ta boîte mail — un accusé de réception arrive." });
}
