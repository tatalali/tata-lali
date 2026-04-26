import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function isAuthed(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const jar = await cookies();
  return jar.get("admin_token")?.value === secret;
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem" }}>
        <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Tata Lali — Admin</span>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <a href="/admin" style={{ color: "#374151", textDecoration: "none", fontSize: "0.9rem" }}>Dashboard</a>
          <a href="/admin/subscribers" style={{ color: "#374151", textDecoration: "none", fontSize: "0.9rem" }}>Subscribers</a>
        </nav>
        <form action="/api/admin/logout" method="POST" style={{ marginLeft: "auto" }}>
          <button type="submit" style={{ fontSize: "0.8rem", color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
            Déconnexion
          </button>
        </form>
      </header>
      <main>{children}</main>
    </div>
  );
}
