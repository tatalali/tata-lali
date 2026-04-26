export async function POST() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin/login",
      "Set-Cookie": "admin_token=; Path=/admin; HttpOnly; Max-Age=0",
    },
  });
}
