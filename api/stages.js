import { stages } from "../server/curriculum.js";

// معادل server/index.js → GET /api/stages برای اجرا روی Vercel Serverless
export default function handler(_req, res) {
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).json(stages);
}
