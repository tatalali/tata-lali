import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "./i18n/config";

const LOCALE_SET = new Set<string>(LOCALES);

function pickLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  // Parse "fr-FR,fr;q=0.9,en;q=0.8" into ordered tags
  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...rest] = part.trim().split(";");
      const q = rest
        .map((s) => s.trim())
        .find((s) => s.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(quality) ? quality : 0 };
    })
    .filter((t) => t.tag)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of tags) {
    // exact match (e.g. "fr")
    if (LOCALE_SET.has(tag)) return tag as Locale;
    // primary subtag (e.g. "fr-fr" → "fr")
    const primary = tag.split("-")[0];
    if (LOCALE_SET.has(primary)) return primary as Locale;
  }
  return DEFAULT_LOCALE;
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip API, _next, and static assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/.well-known") ||
    pathname.includes(".") // static files: favicon.ico, sitemap.xml, etc.
  ) {
    return NextResponse.next();
  }

  // Already on a locale path?
  const seg = pathname.split("/")[1];
  if (LOCALE_SET.has(seg)) return NextResponse.next();

  // Detect locale from Accept-Language and redirect
  const detected = pickLocaleFromAcceptLanguage(
    req.headers.get("accept-language"),
  );
  const url = req.nextUrl.clone();
  url.pathname = `/${detected}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
