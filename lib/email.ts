type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Tata Lali <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing — email not sent", { to: payload.to });
    return { ok: false, error: "no-api-key" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [payload.to],
        subject: payload.subject,
        text: payload.text,
        ...(payload.html ? { html: payload.html } : {}),
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[email] Resend error", res.status, detail);
      return { ok: false, error: `resend-${res.status}` };
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[email] fetch failed", err);
    return { ok: false, error: "network" };
  }
}

const PAYMENT_THANKS_FR = (email: string) => ({
  subject: "Merci ! Ta pré-réservation Tata Lali est confirmée.",
  text: [
    "Salut,",
    "",
    "C'est Tata Lali. Ta pré-réservation à 2€ vient d'arriver — merci de me faire confiance.",
    "",
    "Voilà ce qui se passe maintenant :",
    "— Tu fais partie des tout premiers. Tu auras la première leçon dès le lancement (printemps 2026).",
    "— Pas de spam entre temps. Promis.",
    "— Tu peux répondre à ce mail si tu veux me dire ce qui te ferait plaisir d'apprendre en priorité.",
    "",
    "À très vite,",
    "Tata Lali",
    "",
    "—",
    `Confirmation envoyée à ${email}.`,
  ].join("\n"),
});

const PAYMENT_THANKS_EN = (email: string) => ({
  subject: "Thanks! Your Tata Lali pre-order is confirmed.",
  text: [
    "Hi,",
    "",
    "It's Tata Lali. Your 2€ pre-order just came in — thank you for trusting me.",
    "",
    "Here's what happens next:",
    "— You're among the very first. You'll get lesson one at launch (spring 2026).",
    "— No spam in the meantime. Promise.",
    "— Reply to this email if you want to tell me what you'd love to learn first.",
    "",
    "Talk soon,",
    "Tata Lali",
    "",
    "—",
    `Confirmation sent to ${email}.`,
  ].join("\n"),
});

const PAYMENT_THANKS_DE = (email: string) => ({
  subject: "Danke! Deine Tata Lali Vorbestellung ist bestätigt.",
  text: [
    "Hallo,",
    "",
    "Hier ist Tata Lali. Deine 2€ Vorbestellung ist gerade eingegangen — danke für dein Vertrauen.",
    "",
    "Was jetzt passiert:",
    "— Du gehörst zu den allerersten. Die erste Lektion bekommst du zum Start (Frühjahr 2026).",
    "— Kein Spam in der Zwischenzeit. Versprochen.",
    "— Antworte auf diese E-Mail, wenn du mir sagen willst, was du zuerst lernen möchtest.",
    "",
    "Bis bald,",
    "Tata Lali",
    "",
    "—",
    `Bestätigung gesendet an ${email}.`,
  ].join("\n"),
});

const PAYMENT_THANKS_ES = (email: string) => ({
  subject: "¡Gracias! Tu reserva de Tata Lali está confirmada.",
  text: [
    "Hola,",
    "",
    "Soy Tata Lali. Tu reserva de 2€ acaba de llegar — gracias por confiar en mí.",
    "",
    "Esto es lo que pasa ahora:",
    "— Estás entre los primeros. Recibirás la primera lección en el lanzamiento (primavera 2026).",
    "— Sin spam mientras tanto. Prometido.",
    "— Responde a este correo si quieres decirme qué te gustaría aprender primero.",
    "",
    "Hasta pronto,",
    "Tata Lali",
    "",
    "—",
    `Confirmación enviada a ${email}.`,
  ].join("\n"),
});

const PAYMENT_THANKS_IT = (email: string) => ({
  subject: "Grazie! La tua prenotazione Tata Lali è confermata.",
  text: [
    "Ciao,",
    "",
    "Sono Tata Lali. La tua prenotazione da 2€ è appena arrivata — grazie per la fiducia.",
    "",
    "Ecco cosa succede ora:",
    "— Sei tra i primissimi. La prima lezione ti arriverà al lancio (primavera 2026).",
    "— Nessuno spam nel frattempo. Promesso.",
    "— Rispondi a questa mail se vuoi dirmi cosa ti piacerebbe imparare per primo.",
    "",
    "A presto,",
    "Tata Lali",
    "",
    "—",
    `Conferma inviata a ${email}.`,
  ].join("\n"),
});

export function paymentThanksTemplate(locale: string, email: string) {
  switch (locale) {
    case "en":
      return PAYMENT_THANKS_EN(email);
    case "de":
      return PAYMENT_THANKS_DE(email);
    case "es":
      return PAYMENT_THANKS_ES(email);
    case "it":
      return PAYMENT_THANKS_IT(email);
    default:
      return PAYMENT_THANKS_FR(email);
  }
}
