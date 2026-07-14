// Claude-Anbindung für Five Fingers.
//
// Ein einziger strukturierter Aufruf klassifiziert eine eingehende
// E-Mail (Ampelfarbe + Kategorie + Zusammenfassung) UND erzeugt direkt
// einen Antwortentwurf. Danach greifen die deterministischen Regeln
// aus rules.js (Human-in-the-Loop).
//
// SDK: @anthropic-ai/sdk  •  Modell: claude-opus-4-8 (adaptive thinking,
// structured outputs via output_config.format).

import Anthropic from "@anthropic-ai/sdk";
import { applyRules, AMPEL_LABEL } from "./rules.js";

const MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-8";

const client = new Anthropic({
  // Liest ANTHROPIC_API_KEY automatisch aus der Umgebung.
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// JSON-Schema, an das Claude seine Antwort gebunden ausgibt.
const RESULT_SCHEMA = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["red", "yellow", "green"],
      description:
        "Ampel-Vorschlag: red=persönlich bearbeiten, yellow=Entwurf prüfen, green=automatisch möglich.",
    },
    confidence: {
      type: "number",
      description: "Sicherheit der Einordnung zwischen 0 und 1.",
    },
    category: {
      type: "string",
      description: "Kurze Kategorie, z. B. Terminanfrage, Angebot, Reklamation.",
    },
    summary: {
      type: "string",
      description: "Ein-Satz-Zusammenfassung des Anliegens auf Deutsch.",
    },
    draft: {
      type: "string",
      description:
        "Höflicher, vollständiger Antwortentwurf auf Deutsch inkl. Grußformel.",
    },
  },
  required: ["status", "confidence", "category", "summary", "draft"],
  additionalProperties: false,
};

function systemPrompt() {
  const name = process.env.COMPANY_NAME || "unser Unternehmen";
  const branche = process.env.COMPANY_BRANCHE || "Dienstleistung";
  const signature = (process.env.COMPANY_SIGNATURE || "Mit freundlichen Grüßen").replace(/\\n/g, "\n");
  return [
    `Du bist der KI-Kommunikationsassistent von "${name}" (Branche: ${branche}).`,
    "Du bearbeitest eingehende Kundennachrichten für ein deutsches KMU.",
    "",
    "Ordne jede Nachricht einer Ampelfarbe zu:",
    "- red   = rechtlich/emotional heikel oder unklar → Mensch bearbeitet persönlich.",
    "- yellow = Standardfall, aber Freigabe durch Mensch sinnvoll (Angebote, Preise, Termine).",
    "- green = einfache, eindeutige Auskunft, die nach festen Regeln automatisch beantwortet werden kann.",
    "Im Zweifel stufst du höher (Richtung red) ein – niemals riskant automatisch.",
    "",
    "Formuliere den Entwurf höflich, konkret und in der Sprache der Kundennachricht.",
    `Beende den Entwurf mit dieser Signatur:\n${signature}`,
  ].join("\n");
}

function extractJson(message) {
  // Bei adaptive thinking enthält content ggf. thinking-Blöcke vor dem Text.
  const textBlock = (message.content || []).find((b) => b.type === "text");
  if (!textBlock) throw new Error("Keine Textantwort von Claude erhalten.");
  return JSON.parse(textBlock.text);
}

/**
 * Klassifiziert eine E-Mail und erstellt einen Antwortentwurf.
 * @param {{from?:string, subject:string, body:string}} email
 */
export async function analyzeEmail(email) {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: systemPrompt(),
    output_config: {
      format: { type: "json_schema", schema: RESULT_SCHEMA },
    },
    messages: [
      {
        role: "user",
        content:
          `Neue Nachricht analysieren.\n\n` +
          `Von: ${email.from || "unbekannt"}\n` +
          `Betreff: ${email.subject}\n\n` +
          `${email.body}`,
      },
    ],
  });

  const ai = extractJson(message);

  // Deterministische Geschäftsregeln über den KI-Vorschlag legen.
  const ruled = applyRules({
    status: ai.status,
    subject: email.subject,
    body: email.body,
    confidence: ai.confidence,
  });

  const label = AMPEL_LABEL[ruled.status];
  return {
    status: ruled.status,
    ampel: label.name,
    empfehlung: label.action,
    category: ai.category,
    summary: ai.summary,
    confidence: ai.confidence,
    draft: ai.draft,
    // Automatischer Versand nur bei grün nach Regelprüfung.
    autoSendAllowed: ruled.status === "green",
    ruleNotes: ruled.reasons,
    overriddenByRules: ruled.overridden,
    model: MODEL,
  };
}
