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
          metadata?: Record<string, string>;
        }
      | undefined;

    const email = session?.customer_email ?? session?.customer_details?.email;
    const amount = session?.amount_total ?? 0;

    console.log("[stripe] checkout.session.completed", {
      session_id: session?.id,
      email,
      amount_cents: amount,
      currency: session?.currency,
      source: session?.metadata?.source,
    });

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
            amount_cents: amount,
            currency: session?.currency,
            session_id: session?.id,
            source: session?.metadata?.source,
          }),
        });
      } catch (err) {
        console.error("[stripe] failed to forward to corp", err);
      }
    }
  }

  return Response.json({ ok: true });
}
