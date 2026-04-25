"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function InscriptionForm({ source = "landing" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Quelque chose n'a pas fonctionné. Réessayez.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "Merci. Vous recevrez un mot quand on ouvre.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Réseau indisponible. Réessayez dans un instant.");
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-4">
        <p className="caption">Inscrit · Merci</p>
        <p className="text-[19px] md:text-[22px] leading-snug">
          {message}
        </p>
        <p className="text-[15px] opacity-60">
          Aucun mail intermédiaire. Pas de newsletter. Juste un message le jour
          de l'ouverture.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <label className="block">
        <span className="caption block mb-3">Votre adresse e-mail</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={status === "error"}
          placeholder="prenom.nom@exemple.fr"
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
        {status === "loading" ? "Envoi…" : "M'inscrire"}
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
        Une seule adresse, gardée chez nous. Pas de revente. Pas de newsletter.
        Vous pouvez vous désinscrire en répondant <i>stop</i>.
      </p>
    </form>
  );
}
