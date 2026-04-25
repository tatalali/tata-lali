import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://tatalali.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "fr-FR": "https://tatalali.com",
          "fr-BE": "https://tatalali.com",
          "fr-CH": "https://tatalali.com",
          "fr-CA": "https://tatalali.com",
        },
      },
    },
  ];
}
