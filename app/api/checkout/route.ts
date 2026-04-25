import { NextRequest } from "next/server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tatalali.com";

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return Response.json(
      {
        ok: false,
        message:
          "La pré-réservation payante n'est pas encore branchée. Inscrivez-vous à la liste plus bas, on vous écrit le jour J.",
      },
      { status: 503 }
    );
  }

  let source = "cta-buy";
  try {
    const body = (await request.json()) as { source?: unknown };
    if (typeof body.source === "string" && body.source.length < 60) {
      source = body.source;
    }
  } catch {
    // body optional — silent
  }

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("payment_method_types[]", "card");
  params.append("line_items[0][quantity]", "1");
  params.append("line_items[0][price_data][currency]", "eur");
  params.append("line_items[0][price_data][unit_amount]", "200");
  params.append(
    "line_items[0][price_data][product_data][name]",
    "Tata Lali — Pré-réservation"
  );
  params.append(
    "line_items[0][price_data][product_data][description]",
    "30 leçons pour apprendre l'IA, sans paniquer. Livraison printemps 2026 par mail."
  );
  params.append("success_url", `${SITE}/merci?session_id={CHECKOUT_SESSION_ID}`);
  params.append("cancel_url", `${SITE}/`);
  params.append("allow_promotion_codes", "false");
  params.append("billing_address_collection", "auto");
  params.append("locale", "fr");
  params.append("metadata[source]", source);
  params.append("metadata[product]", "tata-lali-pre-order-v1");

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = (await res.json().catch(() => ({}))) as {
      url?: string;
      id?: string;
      error?: { message?: string };
    };

    if (!res.ok || !data.url) {
      console.error("[checkout] Stripe error", res.status, data.error);
      return Response.json(
        {
          ok: false,
          message:
            "Le paiement est temporairement indisponible. Réessayez dans une minute.",
        },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, url: data.url, id: data.id });
  } catch (err) {
    console.error("[checkout] fetch Stripe failed", err);
    return Response.json(
      { ok: false, message: "Réseau indisponible. Réessayez dans un instant." },
      { status: 502 }
    );
  }
}
