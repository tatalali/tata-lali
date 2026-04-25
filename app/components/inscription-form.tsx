"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Status = "idle" | "loading" | "success" | "error";

export function InscriptionForm({
  source = "landing",
  locale = "fr",
  dict,
}: {
  source?: string;
  locale?: Locale;
  dict?: Dictionary;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const t = dict?.ctaSubscribe ?? {
    cta: "M'inscrire",
    placeholder: "prenom.nom@exemple.fr",
    label: "Votre adresse e-mail",
    successCaption: "Inscrit · Merci",
    successMsg: "Merci. Vous recevrez un mot quand on ouvre.",
    successFootnote:
      "Aucun mail intermédiaire. Pas de newsletter. Juste un message le jour de l'ouverture.",
    legal:
      "Une seule adresse, gardée chez nous. Pas de revente. Pas de newsletter. Vous pouvez vous désinscrire en répondant stop.",
    h2: "",
    sub: "",
    tagline: "",
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, locale }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? t.successMsg);
        return;
      }

      setStatus("success");
      setMessage(data.message ?? t.successMsg);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(t.successMsg);
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-4">
        <p className="caption">{t.successCaption}</p>
        <p className="text-[19px] md:text-[22px] leading-snug">{message}</p>
        <p className="text-[15px] opacity-60">{t.successFootnote}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <label className="block">
        <span className="caption block mb-3">{t.label}</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={status === "error"}
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-line"
          disabled={status === "loading"}
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading" || email.length < 4}
        className="btn-alert w-full md:w-auto"
      >
        {status === "loading" ? "…" : t.cta}
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

      <p className="text-[14px] md:text-[15px] opacity-60 leading-relaxed">
        {t.legal}
      </p>
    </form>
  );
}
