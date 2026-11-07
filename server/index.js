import express from "express";
import cors from "cors";
import { stages } from "./curriculum.js";
const app = express();
app.use(cors(), express.json());
app.get("/api/stages", (_req, res) => res.json(stages));
app.get("/api/stages/:slug", (req, res) => {
  const s = stages.find(x => x.slug === req.params.slug);
  s ? res.json(s) : res.status(404).json({ error: "مرحله‌ای با این نام پیدا نشد" });
});
app.listen(4000, () => console.log("API on :4000"));
