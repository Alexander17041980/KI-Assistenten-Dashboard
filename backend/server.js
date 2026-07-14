// Five Fingers – HTTP-Backend.
//
// Stellt die Ampel-Klassifikation und Entwurfserstellung als kleine
// REST-API bereit. Dieselbe Logik, die das Demo-Dashboard visualisiert,
// läuft hier gegen echte Nachrichten.
//
// Endpunkte:
//   GET  /health            – Statuscheck
//   POST /classify          – { from?, subject, body } → Ampel + Entwurf
//   GET  /gmail/unread      – ungelesene Gmail-Nachrichten (falls konfiguriert)
//   POST /gmail/draft       – Entwurf im Gmail-Postfach anlegen

import "dotenv/config";
import express from "express";
import { analyzeEmail } from "./src/ai.js";
import { getRecentUnread, createDraft } from "./src/gmail.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "five-fingers-backend",
    model: process.env.CLAUDE_MODEL || "claude-opus-4-8",
    hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY),
  });
});

app.post("/classify", async (req, res) => {
  const { subject, body, from } = req.body || {};
  if (!subject || !body) {
    return res.status(400).json({ error: "subject und body sind erforderlich." });
  }
  try {
    const result = await analyzeEmail({ from, subject, body });
    res.json(result);
  } catch (err) {
    console.error("classify-Fehler:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/gmail/unread", async (req, res) => {
  try {
    const max = Number(req.query.max) || 10;
    const mails = await getRecentUnread(max);
    // Direkt jede Nachricht durch die Ampel-Analyse schicken.
    const analyzed = [];
    for (const m of mails) {
      analyzed.push({ ...m, analysis: await analyzeEmail(m) });
    }
    res.json(analyzed);
  } catch (err) {
    console.error("gmail/unread-Fehler:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/gmail/draft", async (req, res) => {
  const { to, subject, body } = req.body || {};
  if (!to || !subject || !body) {
    return res.status(400).json({ error: "to, subject und body sind erforderlich." });
  }
  try {
    res.json(await createDraft({ to, subject, body }));
  } catch (err) {
    console.error("gmail/draft-Fehler:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Five Fingers Backend läuft auf http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("⚠  ANTHROPIC_API_KEY fehlt – /classify liefert einen Fehler, bis er gesetzt ist.");
  }
});
