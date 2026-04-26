export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: 320, padding: "2rem", border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <h1 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Tata Lali — Admin</h1>
        <form action="/api/admin/auth" method="POST">
          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: 6 }}>
            Mot de passe admin
          </label>
          <input
            type="password"
            name="secret"
            required
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: 4, fontSize: "0.9rem", marginBottom: "1rem", boxSizing: "border-box" }}
          />
          <button
            type="submit"
            style={{ width: "100%", padding: "0.6rem", background: "#111827", color: "#fff", border: "none", borderRadius: 4, fontSize: "0.9rem", cursor: "pointer" }}
          >
            Entrer
          </button>
        </form>
      </div>
    </div>
  );
}
