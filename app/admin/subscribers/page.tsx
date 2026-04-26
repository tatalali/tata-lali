import { db, subscribers } from "@/db";
import { desc, ilike, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getSubscribers(q?: string) {
  if (!process.env.DATABASE_URL) return [];
  const base = db
    .select()
    .from(subscribers)
    .orderBy(desc(subscribers.createdAt))
    .limit(200);

  if (q) {
    return db
      .select()
      .from(subscribers)
      .where(or(ilike(subscribers.email, `%${q}%`), ilike(subscribers.locale, `%${q}%`)))
      .orderBy(desc(subscribers.createdAt))
      .limit(200);
  }
  return base;
}

const STATUS_COLOR: Record<string, string> = {
  paid: "#16a34a",
  subscribed: "#2563eb",
  unsubscribed: "#9ca3af",
};

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const rows = await getSubscribers(q);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Subscribers ({rows.length})</h1>
        <form method="GET" style={{ display: "flex", gap: "0.5rem" }}>
          <input
            name="q"
            defaultValue={q}
            placeholder="Rechercher email ou locale…"
            style={{ padding: "0.4rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 4, fontSize: "0.85rem", width: 240 }}
          />
          <button type="submit" style={{ padding: "0.4rem 0.75rem", background: "#111827", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "0.85rem" }}>
            Chercher
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Aucun inscrit{q ? ` pour "${q}"` : " pour l'instant"}.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left", color: "#6b7280" }}>
              <th style={{ padding: "0.5rem 0.75rem" }}>Email</th>
              <th style={{ padding: "0.5rem 0.75rem" }}>Locale</th>
              <th style={{ padding: "0.5rem 0.75rem" }}>Source</th>
              <th style={{ padding: "0.5rem 0.75rem" }}>Statut</th>
              <th style={{ padding: "0.5rem 0.75rem" }}>Inscrit le</th>
              <th style={{ padding: "0.5rem 0.75rem" }}>Payé le</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace" }}>{r.email}</td>
                <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>{r.locale.toUpperCase()}</td>
                <td style={{ padding: "0.5rem 0.75rem", color: "#6b7280" }}>{r.source}</td>
                <td style={{ padding: "0.5rem 0.75rem" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "0.15rem 0.5rem",
                    borderRadius: 12,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: `${STATUS_COLOR[r.status] ?? "#9ca3af"}20`,
                    color: STATUS_COLOR[r.status] ?? "#9ca3af",
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: "0.5rem 0.75rem", color: "#6b7280" }}>
                  {r.createdAt.toLocaleDateString("fr-FR")}
                </td>
                <td style={{ padding: "0.5rem 0.75rem", color: "#16a34a" }}>
                  {r.paidAt ? r.paidAt.toLocaleDateString("fr-FR") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
