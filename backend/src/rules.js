// Ampel-Logik von Five Fingers – deterministische Leitplanken.
//
// Claude schlägt eine Ampelfarbe vor (rot/gelb/grün). Diese Regeln
// KORRIGIEREN den Vorschlag nach festen Geschäftsregeln, damit die KI
// nie eigenmächtig etwas Sensibles automatisch versendet.
//
//   rot   = Manuell      → Mensch bearbeitet persönlich, KI sendet nie
//   gelb  = Prüfen       → KI erstellt Entwurf, Mensch gibt frei
//   grün  = Automatisch  → KI darf nach Regeln selbst senden
//
// Human-in-the-Loop-Prinzip (Art. 50 EU AI Act, DSGVO): Im Zweifel
// wird immer heraufgestuft (Richtung rot), niemals herabgestuft.

const ORDER = { green: 0, yellow: 1, red: 2 };

// Begriffe, die eine E-Mail immer zur manuellen Bearbeitung zwingen.
const HARD_MANUAL = [
  "kündigung", "kuendigung", "widerspruch", "anwalt", "klage", "gericht",
  "mahnung", "inkasso", "schadensersatz", "rückerstattung", "rueckerstattung",
  "beschwerde", "reklamation", "vertragsstrafe", "datenschutz", "dsgvo-auskunft",
];

// Begriffe, die mindestens eine menschliche Prüfung (gelb) auslösen.
const REVIEW_TRIGGERS = [
  "angebot", "preis", "rabatt", "vertrag", "termin verschieben",
  "storno", "individuell", "sonderfall",
];

function escalate(current, floor) {
  return ORDER[floor] > ORDER[current] ? floor : current;
}

/**
 * Wendet die Geschäftsregeln auf einen Claude-Vorschlag an.
 * @param {{status:"red"|"yellow"|"green", subject?:string, body?:string, confidence?:number}} suggestion
 * @returns {{status:"red"|"yellow"|"green", reasons:string[], overridden:boolean}}
 */
export function applyRules(suggestion) {
  const text = `${suggestion.subject || ""} ${suggestion.body || ""}`.toLowerCase();
  let status = suggestion.status;
  const start = status;
  const reasons = [];

  const hard = HARD_MANUAL.find((w) => text.includes(w));
  if (hard) {
    status = escalate(status, "red");
    reasons.push(`Sensibles Thema erkannt ("${hard}") → manuelle Bearbeitung`);
  }

  const review = REVIEW_TRIGGERS.find((w) => text.includes(w));
  if (review) {
    status = escalate(status, "yellow");
    reasons.push(`Prüfrelevanter Begriff ("${review}") → Freigabe durch Mensch`);
  }

  // Niedrige Modell-Sicherheit -> nie automatisch senden.
  if (typeof suggestion.confidence === "number" && suggestion.confidence < 0.6) {
    status = escalate(status, "yellow");
    reasons.push(`Geringe KI-Sicherheit (${Math.round(suggestion.confidence * 100)} %) → Prüfen`);
  }

  return { status, reasons, overridden: status !== start };
}

export const AMPEL_LABEL = {
  red: { name: "Rot – Manuell", action: "Persönlich bearbeiten" },
  yellow: { name: "Gelb – Prüfen", action: "Vor dem Senden kontrollieren" },
  green: { name: "Grün – Automatisch", action: "KI darf nach Regeln senden" },
};
