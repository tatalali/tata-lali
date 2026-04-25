"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "error";

export function BuyButton({
  source = "cta-buy",
  label = "Réserver pour 2€",
  variant = "primary",
}: {
  source?: string;
  label?: string;
  variant?: "primary" | "ghost";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onClick() {
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        message?: string;
      };
      if (!res.ok || !data.ok || !data.url) {
        setStatus("error");
        setMessage(data.message ?? "Indisponible. Réessayez.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setStatus("error");
      setMessage("Réseau indisponible. Réessayez dans un instant.");
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
        {status === "loading" ? "Redirection…" : label}
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
        Paiement sécurisé Stripe. 2€ pour réserver les 30 leçons. Vous recevrez
        la première leçon le jour de l'ouverture, printemps 2026.
      </p>
    </div>
  );
}
