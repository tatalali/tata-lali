import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const secret = form.get("secret") as string | null;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/admin/login?error=1" },
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin",
      "Set-Cookie": `admin_token=${adminSecret}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=86400`,
    },
  });
}
