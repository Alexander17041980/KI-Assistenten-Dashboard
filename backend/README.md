# Five Fingers – Backend

Vom Prototyp zum echten Produkt: Dieses Backend nimmt **echte** Kundennachrichten
entgegen, klassifiziert sie mit Claude nach der **Ampel-Logik** (rot/gelb/grün)
und erzeugt einen Antwortentwurf. Die Geschäftsregeln (`src/rules.js`) sorgen
dafür, dass die KI nichts Heikles eigenmächtig versendet – **Human-in-the-Loop**
gemäß Art. 50 EU AI Act und DSGVO.

Das Demo-Dashboard (Repo-Wurzel) visualisiert genau diese Logik. Das Backend
lässt sie gegen reale Postfächer laufen.

## Architektur

```
E-Mail ──▶ server.js ──▶ src/ai.js ──▶ Claude (claude-opus-4-8)
                              │              structured output
                              ▼
                        src/rules.js  (Ampel-Leitplanken, im Zweifel hochstufen)
                              │
                              ▼
          rot = manuell · gelb = prüfen · grün = automatisch
```

- **`src/ai.js`** – Ein strukturierter Claude-Aufruf (adaptive thinking,
  `output_config.format` mit JSON-Schema) liefert Ampelfarbe, Kategorie,
  Zusammenfassung und Antwortentwurf.
- **`src/rules.js`** – Deterministische Regeln über dem KI-Vorschlag.
  Sensible Begriffe (Kündigung, Anwalt, Mahnung …) erzwingen *rot*,
  Angebote/Preise mindestens *gelb*, niedrige Modell-Sicherheit ebenfalls.
- **`src/gmail.js`** – Optionale Gmail-Anbindung (ungelesene Mails lesen,
  Entwürfe anlegen – nie automatisch senden).
- **`server.js`** – Express-API.

## Schnellstart

```bash
cd backend
cp .env.example .env        # ANTHROPIC_API_KEY eintragen
npm install
npm start                   # http://localhost:8787
```

> **Sicherheit:** Die echte `.env` wird nicht committet (`.gitignore`).
> Niemals API-Keys ins Repository legen.

## Endpunkte

### `GET /health`
Statuscheck inkl. Anzeige, ob ein API-Key gesetzt ist.

### `POST /classify`
```bash
curl -X POST http://localhost:8787/classify \
  -H "Content-Type: application/json" \
  -d '{
    "from": "kundin@example.de",
    "subject": "Terminanfrage nächste Woche",
    "body": "Guten Tag, hätten Sie am Dienstag einen Termin frei?"
  }'
```
Antwort (gekürzt):
```json
{
  "status": "yellow",
  "ampel": "Gelb – Prüfen",
  "empfehlung": "Vor dem Senden kontrollieren",
  "category": "Terminanfrage",
  "summary": "Kundin fragt nach einem Termin am Dienstag.",
  "confidence": 0.82,
  "draft": "Guten Tag, gerne … Mit freundlichen Grüßen",
  "autoSendAllowed": false,
  "ruleNotes": [],
  "model": "claude-opus-4-8"
}
```

### `GET /gmail/unread?max=10`
Liest ungelesene Nachrichten und analysiert jede direkt (nur wenn Gmail in
`.env` konfiguriert ist).

### `POST /gmail/draft`
Legt einen Antwortentwurf im Postfach an – **sendet nicht**, damit der Mensch
bei gelb/rot immer freigibt.

## Nächste Schritte (Produktreife)

- Persistenz (Postgres) für Vorgänge und Freigaben statt In-Memory.
- Weitere Kanäle (Telefon-Transkripte, Social) über dasselbe `analyzeEmail`.
- Regel-Editor im Dashboard, der `src/rules.js` befüllt.
- Authentifizierung/Mandantenfähigkeit vor dem produktiven Einsatz.
