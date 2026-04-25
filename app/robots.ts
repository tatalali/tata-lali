import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://tatalali.com/sitemap.xml",
    host: "https://tatalali.com",
  };
}
