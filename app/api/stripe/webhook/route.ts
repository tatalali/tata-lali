import { NextRequest } from "next/server";
import Stripe from "stripe";
import { sendEmail, paymentThanksTemplate } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!signature) {
    return Response.json({ ok: false, error: "missing-signature" }, { status: 400 });
  }
  if (!webhookSecret || !stripeKey) {
    console.error("[stripe] webhook secret or API key not configured");
    return Response.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe] signature verification failed", err);
    return Response.json({ ok: false, error: "invalid-signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email ?? session.customer_details?.email ?? null;
    const locale = (session.metadata?.locale as string) ?? "fr";
    const sessionId = session.id;
    const customerId = typeof session.customer === "string" ? session.customer : undefined;
    const amountCents = session.amount_total ?? 0;

    console.log("[stripe] checkout.session.completed", {
      session_id: sessionId,
      email,
      amount_cents: amountCents,
      currency: session.currency,
      locale,
    });

    if (!email) {
      console.warn("[stripe] no email on session — skipping persistence", { sessionId });
      return Response.json({ ok: true, warning: "no-email" });
    }

    if (process.env.DATABASE_URL) {
      try {
        const { db, subscribers } = await import("@/db");
        const { eq } = await import("drizzle-orm");

        const existing = await db
          .select()
          .from(subscribers)
          .where(eq(subscribers.email, email))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(subscribers)
            .set({
              status: "paid",
              paidAt: new Date(),
              stripeSessionId: sessionId,
              stripeCustomerId: customerId,
            })
            .where(eq(subscribers.email, email));
        } else {
          await db.insert(subscribers).values({
            email,
            locale,
            source: "cta_buy",
            status: "paid",
            stripeSessionId: sessionId,
            stripeCustomerId: customerId,
            paidAt: new Date(),
          });
        }
      } catch (err) {
        console.error("[stripe] DB write failed", err);
      }
    }

    const tpl = paymentThanksTemplate(locale, email);
    const emailResult = await sendEmail({
      to: email,
      subject: tpl.subject,
      text: tpl.text,
      replyTo: process.env.RESEND_REPLY_TO ?? undefined,
    });
    if (!emailResult.ok) {
      console.error("[stripe] thanks email failed", emailResult.error);
    } else {
      console.log("[stripe] thanks email sent", { id: emailResult.id, email });
    }

    const corpUrl = process.env.TATALALI_CORP_URL;
    const corpSecret = process.env.STRIPE_FORWARD_SECRET;
    if (corpUrl && corpSecret) {
      try {
        await fetch(`${corpUrl}/api/stripe-event`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${corpSecret}`,
          },
          body: JSON.stringify({
            type: "checkout.session.completed",
            email,
            amount_cents: amountCents,
            currency: session.currency,
            session_id: sessionId,
            locale,
          }),
        });
      } catch (err) {
        console.error("[stripe] corp forward failed", err);
      }
    }
  }

  return Response.json({ ok: true });
}
