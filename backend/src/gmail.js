// Gmail-Anbindung (optional) – dokumentiertes Gerüst.
//
// Dieses Modul zeigt, wie echte Postfächer angebunden werden. Damit das
// Backend ohne Google-Zugangsdaten lauffähig bleibt, ist die Anbindung
// bewusst als schlanker REST-Wrapper (fetch) gehalten und wirft eine
// klare Fehlermeldung, wenn Zugangsdaten fehlen.
//
// Einrichtung (einmalig):
//   1. Google Cloud Console → neues Projekt → Gmail API aktivieren.
//   2. OAuth-Zustimmungsbildschirm einrichten, Scope:
//        https://www.googleapis.com/auth/gmail.modify
//   3. OAuth-Client (Typ "Desktop") anlegen → Client-ID + Secret.
//   4. Einmalig einen Refresh-Token erzeugen (OAuth Playground oder
//      eigenes Skript) und in .env als GMAIL_REFRESH_TOKEN hinterlegen.
//
// Danach liefert getRecentUnread() ungelesene Nachrichten, die an
// analyzeEmail() aus ai.js übergeben werden können.

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://gmail.googleapis.com/gmail/v1/users/me";

function requireCreds() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error(
      "Gmail nicht konfiguriert. GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET und " +
        "GMAIL_REFRESH_TOKEN in .env setzen (siehe .env.example)."
    );
  }
  return { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN };
}

// Tauscht den Refresh-Token gegen ein kurzlebiges Access-Token.
async function accessToken() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = requireCreds();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Gmail-Token-Fehler: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

function header(payload, name) {
  const h = (payload.headers || []).find(
    (x) => x.name.toLowerCase() === name.toLowerCase()
  );
  return h ? h.value : "";
}

// Dekodiert base64url-Text aus dem Gmail-Body.
function decodeBody(payload) {
  const part =
    (payload.parts || []).find((p) => p.mimeType === "text/plain") || payload;
  const data = part.body && part.body.data;
  if (!data) return "";
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

/**
 * Holt die neuesten ungelesenen Nachrichten als {id, from, subject, body}.
 * @param {number} max
 */
export async function getRecentUnread(max = 10) {
  const token = await accessToken();
  const auth = { Authorization: `Bearer ${token}` };

  const list = await fetch(
    `${API}/messages?q=${encodeURIComponent("is:unread")}&maxResults=${max}`,
    { headers: auth }
  ).then((r) => r.json());

  const out = [];
  for (const { id } of list.messages || []) {
    const msg = await fetch(`${API}/messages/${id}?format=full`, { headers: auth }).then(
      (r) => r.json()
    );
    out.push({
      id,
      from: header(msg.payload, "From"),
      subject: header(msg.payload, "Subject"),
      body: decodeBody(msg.payload),
    });
  }
  return out;
}

/**
 * Legt einen Antwortentwurf im Gmail-Postfach an (sendet NICHT).
 * So bleibt der Mensch bei gelb/rot immer in der Freigabe-Schleife.
 */
export async function createDraft({ to, subject, body }) {
  const token = await accessToken();
  const raw = Buffer.from(
    `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${body}`
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const res = await fetch(`${API}/drafts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message: { raw } }),
  });
  if (!res.ok) throw new Error(`Gmail-Draft-Fehler: ${res.status} ${await res.text()}`);
  return res.json();
}
