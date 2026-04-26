"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Status = "idle" | "loading" | "error";

export function BuyButton({
  source = "cta-buy",
  label = "Réserver pour 2€",
  variant = "primary",
  locale = "fr",
  dict,
}: {
  source?: string;
  label?: string;
  variant?: "primary" | "ghost";
  locale?: Locale;
  dict?: Dictionary;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const t = dict?.buyButton ?? {
    paymentSecure:
      "Paiement sécurisé Stripe. 2€ pour réserver les 30 leçons. Vous recevrez la première leçon le jour de l'ouverture, printemps 2026.",
    redirecting: "Redirection…",
    errorDefault: "Indisponible. Réessayez.",
  };

  async function onClick() {
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, locale }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        code?: string;
      };
      if (!res.ok || !data.ok || !data.url) {
        setStatus("error");
        setMessage(
          data.code === "stripe_not_configured"
            ? t.stripeNotReady ?? t.errorDefault
            : t.errorDefault
        );
        return;
      }
      window.location.href = data.url;
    } catch {
      setStatus("error");
      setMessage(t.errorDefault);
    }
  }

  const className =
    variant === "primary" ? "btn-alert w-full md:w-auto" : "btn-ghost";

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onClick}
        disabled={status === "loading"}
        className={className}
      >
        {status === "loading" ? t.redirecting : label}
      </button>
      {status === "error" && message && (
        <p
          role="alert"
          className="text-[15px]"
          style={{ color: "var(--color-alerte)" }}
        >
          {message}
        </p>
      )}
      <p className="text-[14px] opacity-60 leading-relaxed">
        {t.paymentSecure}
      </p>
    </div>
  );
}
