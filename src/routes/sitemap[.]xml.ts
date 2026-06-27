import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://spandly.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/app", changefreq: "weekly", priority: "0.9" },
          { path: "/goals", changefreq: "weekly", priority: "0.8" },
          { path: "/analysis", changefreq: "weekly", priority: "0.8" },
          { path: "/subscriptions", changefreq: "monthly", priority: "0.6" },
          { path: "/snap-to-log", changefreq: "monthly", priority: "0.6" },
          { path: "/chai-index", changefreq: "monthly", priority: "0.6" },
          { path: "/xp", changefreq: "monthly", priority: "0.5" },
          { path: "/spend-dna", changefreq: "monthly", priority: "0.5" },
          { path: "/streak-legacy", changefreq: "monthly", priority: "0.5" },
          { path: "/city-pulse", changefreq: "monthly", priority: "0.5" },
          { path: "/month-forecast", changefreq: "monthly", priority: "0.5" },
          { path: "/kharcha-report", changefreq: "monthly", priority: "0.5" },
          { path: "/whatsapp-share", changefreq: "monthly", priority: "0.5" },
          { path: "/roast", changefreq: "monthly", priority: "0.4" },
          { path: "/squad", changefreq: "monthly", priority: "0.4" },
          { path: "/wrapped", changefreq: "monthly", priority: "0.4" },
          { path: "/challenges", changefreq: "monthly", priority: "0.4" },
          { path: "/coach", changefreq: "monthly", priority: "0.4" },
          { path: "/money-persona", changefreq: "weekly", priority: "0.9" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
