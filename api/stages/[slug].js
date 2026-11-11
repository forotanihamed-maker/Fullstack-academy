import { stages } from "../../server/curriculum.js";

// معادل server/index.js → GET /api/stages/:slug
export default function handler(req, res) {
  const stage = stages.find((s) => s.slug === req.query.slug);

  if (!stage) return res.status(404).json({ error: "مرحله پیدا نشد" });

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).json(stage);
}
