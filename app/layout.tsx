// Root layout is a passthrough.
// The real <html> / <body> live in app/[locale]/layout.tsx so we can set
// `lang` dynamically per locale (24 EU languages).
// See: https://nextjs.org/docs/app/building-your-application/routing/internationalization

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
