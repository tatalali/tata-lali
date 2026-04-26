import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!signature) {
    return Response.json({ ok: false, error: "missing-signature" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } } = {};
  try {
    event = JSON.parse(payload);
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object as
      | {
          id?: string;
          amount_total?: number;
          currency?: string;
          customer_email?: string;
          customer_details?: { email?: string; name?: string };
          customer?: string;
          metadata?: Record<string, string>;
        }
      | undefined;

    const email = session?.customer_email ?? session?.customer_details?.email;
    const locale = session?.metadata?.locale ?? "fr";
    const sessionId = session?.id;
    const customerId = typeof session?.customer === "string" ? session.customer : undefined;

    console.log("[stripe] checkout.session.completed", {
      session_id: sessionId,
      email,
      amount_cents: session?.amount_total ?? 0,
      currency: session?.currency,
      locale,
    });

    // Persist to DB
    if (process.env.DATABASE_URL && email) {
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
            .set({ status: "paid", paidAt: new Date(), stripeSessionId: sessionId, stripeCustomerId: customerId })
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

    // Forward to corp (support, CEO brief, welcome email)
    const corpUrl = process.env.TATALALI_CORP_URL;
    const corpSecret = process.env.STRIPE_FORWARD_SECRET;
    if (corpUrl && corpSecret && email) {
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
            amount_cents: session?.amount_total ?? 0,
            currency: session?.currency,
            session_id: sessionId,
            locale,
          }),
        });
      } catch (err) {
        console.error("[stripe] failed to forward to corp", err);
      }
    }
  }

  return Response.json({ ok: true });
}
