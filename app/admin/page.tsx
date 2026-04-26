import { db, subscribers } from "@/db";
import { sql, eq, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getMetrics() {
  if (!process.env.DATABASE_URL) {
    return { total: 0, paid: 0, free: 0, revenue: 0, byLocale: [] as { locale: string; n: number }[] };
  }

  const [totals] = await db
    .select({
      total: count(),
      paid: sql<number>`count(*) filter (where status = 'paid')`,
      free: sql<number>`count(*) filter (where status = 'subscribed')`,
    })
    .from(subscribers);

  const byLocale = await db
    .select({ locale: subscribers.locale, n: count() })
    .from(subscribers)
    .groupBy(subscribers.locale)
    .orderBy(sql`count(*) desc`);

  return {
    total: Number(totals.total),
    paid: Number(totals.paid),
    free: Number(totals.free),
    revenue: Number(totals.paid) * 1.66,
    byLocale,
  };
}

function Card({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "1.25rem 1.5rem", background: "#fff" }}>
      <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: "2rem", fontWeight: 700, color: "#111827" }}>{value}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default async function AdminDashboard() {
  const m = await getMetrics();
  const conv = m.total > 0 ? ((m.paid / m.total) * 100).toFixed(1) : "—";

  return (
    <div>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card label="Inscrits total" value={m.total} />
        <Card label="Payants" value={m.paid} sub={`${conv}% de conversion`} />
        <Card label="Email seul (gratuit)" value={m.free} />
        <Card label="Revenue net estimé" value={`${m.revenue.toFixed(2)} €`} sub="N × 1,66 € net Stripe" />
      </div>

      <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Breakdown par locale</h2>
      {m.byLocale.length === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Aucun inscrit pour l&apos;instant.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
              <th style={{ padding: "0.5rem 0.75rem" }}>Locale</th>
              <th style={{ padding: "0.5rem 0.75rem" }}>Inscrits</th>
              <th style={{ padding: "0.5rem 0.75rem" }}>% du total</th>
            </tr>
          </thead>
          <tbody>
            {m.byLocale.map((r) => (
              <tr key={r.locale} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>{r.locale.toUpperCase()}</td>
                <td style={{ padding: "0.5rem 0.75rem" }}>{r.n}</td>
                <td style={{ padding: "0.5rem 0.75rem", color: "#6b7280" }}>
                  {m.total > 0 ? ((Number(r.n) / m.total) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#9ca3af" }}>
        Données en temps réel depuis Neon Postgres.{" "}
        <a href="/admin/subscribers" style={{ color: "#6b7280" }}>Voir tous les inscrits →</a>
      </p>
    </div>
  );
}
