import {
  getAllProducts,
  getArtForms,
  getStates,
  getTopLevelCategories,
} from "@/lib/api/catalog";
import { getVaultArticles } from "@/lib/api/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const asList = (r) =>
  r.status === "fulfilled"
    ? Array.isArray(r.value)
      ? r.value
      : r.value?.content || []
    : [];

/** Categories arrive as a tree — flatten to include subcategories. */
function flattenCategories(categories) {
  const out = [];
  const walk = (list) => {
    (list || []).forEach((c) => {
      out.push(c);
      walk(c.subCategories);
    });
  };
  walk(categories);
  return out;
}

const entry = (path, priority = 0.6) => ({
  url: `${SITE_URL}${path}`,
  changeFrequency: "weekly",
  priority,
});

export default async function sitemap() {
  const staticEntries = [
    entry("", 1),
    entry("/products", 0.9),
    entry("/offers", 0.8),
    entry("/vault", 0.8),
    entry("/about", 0.5),
    entry("/brand-story", 0.5),
    entry("/contact", 0.5),
    entry("/faqs", 0.5),
    entry("/policies/returns", 0.3),
    entry("/policies/shipping", 0.3),
    entry("/policies/privacy", 0.3),
    entry("/policies/terms", 0.3),
  ];

  const results = await Promise.allSettled([
    getAllProducts({ page: 0, size: 100 }),
    getTopLevelCategories(),
    getStates(),
    getArtForms(),
    getVaultArticles({ page: 0, size: 50 }),
  ]);

  const [products, categories, states, artForms, vault] = results.map(asList);

  const dynamicEntries = [
    ...products
      .filter((p) => p.slug)
      .map((p) => entry(`/products/${encodeURIComponent(p.slug)}`, 0.8)),
    ...flattenCategories(categories)
      .filter((c) => c.slug)
      .map((c) => entry(`/categories/${encodeURIComponent(c.slug)}`, 0.7)),
    ...states
      .filter((s) => s.slug)
      .map((s) => entry(`/states/${encodeURIComponent(s.slug)}`, 0.7)),
    ...artForms
      .filter((a) => a.slug)
      .map((a) => entry(`/artforms/${encodeURIComponent(a.slug)}`, 0.7)),
    ...vault
      .filter((v) => v.slug)
      .map((v) => entry(`/vault/${encodeURIComponent(v.slug)}`, 0.6)),
  ];

  return [...staticEntries, ...dynamicEntries];
}
