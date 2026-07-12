"use strict";

/* ═══════════════════════════ DATEN ═══════════════════════════ */

const state = {
  tokensBudget: 1200000,
  tokensUsed: 516000,
  selected: "m3",
  editing: false,
  demoRunning: false,
  doneToday: 12
};

const mails = [
  {
    id: "m1", status: "red", tag: "Immobilien", tagClass: "red", time: "08:12",
    subject: "Exposé – falsche Wohnfläche", sender: "Sabine Haupt", channel: "E-Mail",
    preview: "118 m² ausgewiesen, tatsächlich 94 m². Schadensersatz gefordert.",
    confidence: 96, cal: "c1", tokens: 1420,
    detail: {
      title: "Sabine Haupt",
      text: "Exposé-Beschwerde mit Schadensersatzforderung. Der Vorgang bleibt rot und wird persönlich bearbeitet.",
      answer: "Keine automatische Antwort.\n\nVorschlag der KI: persönliche Entschuldigung, Sachverhalt prüfen, Rückruftermin anbieten. Zuständig: Alexander Sänger.",
      reason: "Kritische Begriffe erkannt: „falsche Wohnfläche“, „Schadensersatz“. Status Rot, weil ein Haftungsrisiko besteht – hier entscheidet immer ein Mensch."
    }
  },
  {
    id: "m2", status: "red", tag: "Kanzlei", tagClass: "red", time: "09:18",
    subject: "Vertragsfall mit Anhang", sender: "Dr. Klein Kanzlei", channel: "E-Mail",
    preview: "Sensibler Vorgang. KI darf zusammenfassen, aber nicht automatisch senden.",
    confidence: 91, cal: "c2", tokens: 1980,
    detail: {
      title: "Dr. Klein Kanzlei",
      text: "Sensibler Vertragsfall mit Anhang. Die KI darf zusammenfassen, aber nicht automatisch senden.",
      answer: "Zusammenfassung des 14-seitigen Anhangs liegt bereit.\n\nVersand einer Antwort erst nach juristischer Freigabe durch Ralph Kleemann (Legal & Compliance).",
      reason: "Rechtlich sensibler Kontext und Anhang erkannt. Status Rot – definierte Regel: Kanzlei-Vorgänge nie automatisch beantworten."
    }
  },
  {
    id: "m3", status: "yellow", tag: "Steuerbüro", tagClass: "yellow", time: "10:30",
    subject: "Erstgespräch – Terminanfrage", sender: "Müller & Partner", channel: "E-Mail",
    preview: "Kunde möchte drei Terminvorschläge. KI hat Slots vorbereitet.",
    confidence: 82, cal: "c3", tokens: 1240,
    detail: {
      title: "Müller & Partner",
      text: "Terminwunsch für ein Erstgespräch. Die KI hat den Kalender geprüft und drei freie Slots in einen Antwortentwurf übernommen.",
      answer: "Guten Tag Frau Müller,\n\nvielen Dank für Ihre Nachricht. Gern schlage ich Ihnen drei freie Termine für ein Erstgespräch vor:\n\n– Dienstag, 09.06., 10:30 Uhr\n– Mittwoch, 10.06., 14:00 Uhr\n– Freitag, 12.06., 09:00 Uhr\n\nBitte teilen Sie uns kurz mit, welcher Termin für Sie passt.\n\nFreundliche Grüße\nFive Fingers Demo-Team",
      reason: "Erkannte Absicht: Terminwunsch. CRM-Kontext vorhanden, Kalender geprüft, keine kritischen Begriffe. Status Gelb, weil Erstkontakte laut Regelwerk freigegeben werden."
    }
  },
  {
    id: "m4", status: "yellow", tag: "Angebot", tagClass: "yellow", time: "11:05",
    subject: "Rückfrage zum Core-Paket", sender: "Nordlicht Service", channel: "E-Mail",
    preview: "Antwort passt, aber Preisdetail soll vor Versand geprüft werden.",
    confidence: 76, cal: "c4", tokens: 1080,
    detail: {
      title: "Nordlicht Service",
      text: "Rückfrage zum Core-Paket. Die Antwort ist vorbereitet, ein Preisdetail soll vor Versand bestätigt werden.",
      answer: "Guten Tag,\n\nvielen Dank für Ihre Rückfrage. Anbei die Angaben zum Core-Paket:\n\n– Einrichtung: einmalig 25.000 €\n– Lizenz: ab 299 €/Monat\n– Inklusive Betreuung und laufendem Betrieb\n\nDie markierte Preisposition bitte vor Versand bestätigen.\n\nFreundliche Grüße",
      reason: "Preis- und Angebotskontext erkannt. Status Gelb, weil ein wirtschaftliches Detail betroffen ist – Zahlen gibt immer ein Mensch frei."
    }
  },
  {
    id: "m5", status: "yellow", tag: "Lead", tagClass: "purple", time: "12:44",
    subject: "Five Fingers Demo anfragen", sender: "Synlex Demo Lead", channel: "E-Mail",
    preview: "Demo-Termin und Kurzbeschreibung zum Core-Paket gewünscht.",
    confidence: 79, cal: "c5", tokens: 1150,
    detail: {
      title: "Synlex Demo Lead",
      text: "Demo-Anfrage und Wunsch nach kurzer Produktbeschreibung – als Lead im CRM angelegt.",
      answer: "Guten Tag,\n\ngern zeigen wir Ihnen Five Fingers in einer kurzen Demo. Ich schlage Ihnen Dienstag, 13:00 Uhr vor und sende vorab die wichtigsten Eckdaten zum Core-Paket.\n\nFreundliche Grüße",
      reason: "Lead-Kommunikation mit Vertriebschance. Status Gelb, weil Erstkontakt freigegeben werden soll. Lead wurde automatisch im CRM angelegt."
    }
  },
  {
    id: "m6", status: "green", tag: "Fahrschule", tagClass: "green", time: "13:10",
    subject: "Intensivkurs – Terminfrage", sender: "Hansa Training", channel: "E-Mail",
    preview: "Standardfrage zu Preisen, Dauer und nächsten freien Terminen.",
    confidence: 95, cal: "c6", tokens: 920,
    detail: {
      title: "Hansa Training",
      text: "Standardfrage zu Preisen, Dauer und nächsten Terminen – von der Wissensbasis vollständig abgedeckt.",
      answer: "Guten Tag,\n\nvielen Dank für Ihre Anfrage. Der nächste Intensivkurs startet am Freitag. Preise, Dauer und freie Plätze sende ich Ihnen anbei.\n\nFreundliche Grüße",
      reason: "Standard-FAQ mit 95 % Konfidenz, Antwort vollständig aus geprüfter Wissensbasis. Status Grün – Versand nach definierter Regel erlaubt."
    }
  },
  {
    id: "m7", status: "green", tag: "Service", tagClass: "blue", time: "14:02",
    subject: "Termin bestätigt", sender: "Agentur West", channel: "E-Mail",
    preview: "Termin wurde bestätigt, Kalendereintrag bleibt sichtbar.",
    confidence: 93, cal: "c7", tokens: 680,
    detail: {
      title: "Agentur West",
      text: "Terminbestätigung ohne Risiko – Kalendereintrag wurde automatisch erstellt.",
      answer: "Der Termin wurde bestätigt und in den Kalender eingetragen. Die Bestätigung ist im Postausgang dokumentiert.",
      reason: "Terminbestätigung ohne offene Fragen. Status Grün – vollständig automatisch nach Regelwerk erledigt."
    }
  },
  {
    id: "m8", status: "yellow", tag: "Telefon", tagClass: "yellow", time: "18:42",
    subject: "Rückrufwunsch nach Geschäftsschluss", sender: "Thomas Berger", channel: "Telefon",
    preview: "Anrufer drückt 1. Er möchte morgen einen Termin zur Five-Fingers-Demo.",
    confidence: 88, cal: "c8", tokens: 1310, phone: true,
    detail: {
      title: "Telefon: Thomas Berger",
      text: "Anruf nach Geschäftsschluss. Der Anrufer hat 1 gedrückt und möchte einen Rückruf mit Demo-Termin.",
      answer: "Transkript:\n„Guten Abend, hier ist Thomas Berger. Ich habe Five Fingers gesehen und würde gern morgen mit Alexander Sänger sprechen. Am besten vormittags. Bitte rufen Sie mich zurück.“\n\nSystemaktion:\n– Rückrufwunsch erkannt\n– Kalenderfenster morgen 10:30 Uhr vorgeschlagen\n– E-Mail-Assistent bereitet schriftliche Bestätigung vor",
      reason: "Quelle: Telefon-Assistent. Absicht: Rückruf + Terminwunsch. Status Gelb, weil der Termin vor finaler Bestätigung geprüft werden soll."
    }
  },
  {
    id: "m9", status: "red", tag: "Telefon", tagClass: "red", time: "19:08",
    subject: "Beschwerde auf Mailbox", sender: "Unbekannte Nummer", channel: "Telefon",
    preview: "Anrufer drückt 2. Tonfall verärgert, bittet um interne Klärung.",
    confidence: 94, cal: "c9", tokens: 1180, phone: true,
    detail: {
      title: "Telefon: Unbekannte Nummer",
      text: "Anruf nach Geschäftsschluss. Der Anrufer hat 2 gedrückt – kein Rückruf gewünscht, Inhalt aber kritisch.",
      answer: "Transkript:\n„Ich wollte nur mitteilen, dass ich seit Tagen auf eine Antwort warte. Bitte Alexander informieren. Kein Rückruf nötig, aber das sollte intern geklärt werden.“\n\nSystemaktion:\n– Kein Rückruf angelegt\n– Alexander wird informiert\n– Vorgang landet rot auf der Ampel-Pinwand",
      reason: "Quelle: Telefon-Assistent. Kritische Stimmung und Beschwerde erkannt. Status Rot, weil menschliche Klärung notwendig ist."
    }
  }
];

const calendarEvents = [
  { id: "c2", day: 0, row: 0, title: "Kanzlei – Rücksprache", sub: "Dr. Klein Kanzlei", mail: "m2", when: "Mo 02.06. 09:00" },
  { id: "c3", day: 2, row: 0, title: "Müller – Erstgespräch", sub: "Aus E-Mail geöffnet", mail: "m3", when: "Mi 04.06. 09:00" },
  { id: "c6", day: 4, row: 0, title: "Hansa – Kurs", sub: "Automatische Antwort", mail: "m6", when: "Fr 06.06. 09:00" },
  { id: "c1", day: 0, row: 1, title: "Haupt – Immobilien", sub: "Manuelle Klärung", mail: "m1", when: "Mo 02.06. 11:00" },
  { id: "c4", day: 3, row: 1, title: "Nordlicht – Angebot", sub: "Preisdetail prüfen", mail: "m4", when: "Do 05.06. 11:00" },
  { id: "c5", day: 1, row: 2, title: "Synlex – Demo", sub: "Lead aus E-Mail", mail: "m5", when: "Di 03.06. 13:00" },
  { id: "c7", day: 4, row: 2, title: "Agentur West", sub: "Bestätigt", mail: "m7", when: "Fr 06.06. 13:00" },
  { id: "c8", day: 1, row: 1, title: "Rückruf Berger", sub: "Telefon-Assistent", mail: "m8", when: "Morgen 10:30" }
];

const outbox = [
  { to: "Hansa Training", subject: "Re: Intensivkurs", status: "sent", ki: "KI-geprüft", tokens: 920, time: "13:12" },
  { to: "Agentur West", subject: "Re: Termin", status: "sent", ki: "KI-geprüft", tokens: 680, time: "14:03" },
  { to: "Müller & Partner", subject: "Re: Erstgespräch", status: "draft", ki: "KI-Entwurf", tokens: 1240, time: "10:31" },
  { to: "Nordlicht Service", subject: "Re: Core-Paket", status: "draft", ki: "KI-Entwurf", tokens: 1080, time: "11:06" }
];

const weekData = [
  { day: "Mo", value: 34 }, { day: "Di", value: 41 }, { day: "Mi", value: 38 },
  { day: "Do", value: 47 }, { day: "Fr", value: 29 }, { day: "Sa", value: 8 }, { day: "So", value: 5 }
];

const activities = [
  { time: "14:02", text: "E-Mail-Assistent hat „Termin bestätigt“ automatisch beantwortet", mail: "m7" },
  { time: "13:11", text: "Wissensbasis-Antwort für Hansa Training freigegeben", mail: "m6" },
  { time: "12:45", text: "Neuer Lead „Synlex Demo“ im CRM angelegt", mail: "m5" },
  { time: "10:30", text: "Kalender-Assistent hat 3 freie Slots für Müller & Partner gefunden", mail: "m3" },
  { time: "09:20", text: "Anhang der Kanzlei-Mail zusammengefasst (14 Seiten)", mail: "m2" },
  { time: "08:13", text: "Risiko erkannt: Vorgang Haupt auf Rot gestellt", mail: "m1" }
];

const viewCopy = {
  dashboard: ["Übersicht", "Alle Kanäle, alle Vorgänge, ein Blick – die Kommandozentrale von Five Fingers."],
  inbox: ["Posteingang – Ampel-Pinwand", "Links rot (Mensch entscheidet), Mitte gelb (Mensch gibt frei), rechts grün (KI darf nach Regeln)."],
  calendar: ["Kalender", "Grün markierte Termine stammen aus E-Mails. Klick auf einen Termin öffnet den zugehörigen Vorgang."],
  outbox: ["Postausgang", "Freigegebene KI-Antworten, Entwürfe und Token-Verbrauch – jede Zeile klickbar."],
  phone: ["Telefon-Assistent", "Nimmt Anrufe bei besetzt oder nach Feierabend an und übergibt sie als Vorgang an die Ampel."],
  social: ["Social-Media-Assistent", "Erstellt aus CRM, Zielgruppe und Produktdaten eine kanalübergreifende Content-Strategie."],
  customers: ["Kunden", "Kontaktübersicht mit Ampelstatus und letztem Vorgang – Klick öffnet den Vorgang."],
  tokens: ["KI-Übersicht & Token-Budget", "Volle Transparenz über KI-Einsatz, Verbrauch und verbleibendes Monatsbudget."],
  testaccount: ["Test-Modus", "Speise eine Test-Mail ein und verfolge live, wie die KI-Pipeline sie verarbeitet."]
};

const tourSteps = [
  { view: "dashboard", title: "Willkommen bei Five Fingers", text: "Eine Hand für den Mittelstand: fünf KI-Assistenten – Telefon, E-Mail, Kalender, Dashboard, Social Media – arbeiten mit demselben Kundenkontext zusammen. Diese Übersicht zeigt den Nutzen auf einen Blick." },
  { view: "inbox", title: "Die Ampel-Pinwand", text: "Jeder Vorgang wird automatisch klassifiziert: Rot bearbeitet der Mensch, Gelb prüft der Mensch vor dem Senden, Grün darf die KI nach definierten Regeln erledigen. Klicken Sie eine Karte an – rechts erscheinen Entwurf und Begründung." },
  { view: "inbox", title: "Human-in-the-Loop", text: "Im Detail-Panel rechts sehen Sie den KI-Antwortentwurf, die Begründung („Warum diese Antwort?“) und die KI-Kennzeichnung nach Art. 50 EU AI Act. „Freigeben & Senden“, „Bearbeiten“, „Zurückstellen“ und „Manuell“ funktionieren wirklich – probieren Sie es aus." },
  { view: "calendar", title: "Kalender-Assistent", text: "Termine werden direkt aus E-Mails und Anrufen erkannt und eingetragen. Klick auf einen Termin springt zurück zum zugehörigen Vorgang – nichts geht verloren." },
  { view: "phone", title: "Telefon-Assistent", text: "Nach Feierabend oder bei besetzter Leitung nimmt der Assistent an, transkribiert und übergibt an die Ampel. Simulieren Sie hier einen eingehenden Anruf." },
  { view: "tokens", title: "Volle Kostentransparenz", text: "Jeder KI-Vorgang verbraucht Token aus einem festen Monatsbudget – aufgeschlüsselt pro Assistent. Keine Blackbox, keine Kostenüberraschung." },
  { view: "testaccount", title: "Selbst ausprobieren", text: "Im Test-Modus speisen Sie eine eigene Mail ein und sehen live, wie die Pipeline sie klassifiziert, Kontext lädt und einen Entwurf erstellt. Und jetzt: Starten Sie die ▶ Live-Demo oben!" }
];

/* ═══════════════════════════ HELFER ═══════════════════════════ */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtK(n) {
  return n >= 1000000 ? (n / 1000000).toFixed(1).replace(".", ",") + "M" : Math.round(n / 1000) + "k";
}

function fmtNum(n) {
  return n.toLocaleString("de-DE");
}

function nowTime() {
  return new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function statusColor(status) {
  return { red: "var(--red)", yellow: "var(--yellow)", green: "var(--green)" }[status] || "var(--brand-cyan)";
}

function toast(title, text, kind = "info") {
  const el = document.createElement("div");
  el.className = "toast " + (kind === "info" ? "" : kind);
  el.innerHTML = `<strong>${esc(title)}</strong>${esc(text)}`;
  $("#toastStack").appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 4200);
}

function audit(text) {
  const log = $("#auditLog");
  const entry = document.createElement("div");
  entry.className = "audit-entry";
  entry.innerHTML = `<time>${nowTime()}</time><span>${esc(text)}</span>`;
  log.prepend(entry);
}

/* ═══════════════════ RENDERING: BOARD ═══════════════════ */

function noteHtml(mail) {
  const sel = mail.id === state.selected ? " selected" : "";
  const snoozed = mail.snoozed ? " snoozed" : "";
  const link = mail.cal ? "Termin verknüpft" : (mail.phone ? "Transkript erstellt" : "");
  return `
    <button class="note ${mail.status}${sel}${snoozed}" data-id="${mail.id}">
      <div class="note-top"><span class="tag ${mail.tagClass}">${esc(mail.tag)}</span><span class="time">${esc(mail.time)}</span></div>
      <strong class="subject">${esc(mail.subject)}</strong>
      <div class="sender">${esc(mail.sender)}</div>
      <p>${esc(mail.preview)}</p>
      <div class="confidence"><span style="color:${statusColor(mail.status)}">${mail.confidence}% Konfidenz</span><span class="calendar-link">${link}</span></div>
      <div class="conf-bar"><i style="width:${mail.confidence}%;background:${statusColor(mail.status)}"></i></div>
    </button>`;
}

function renderBoard() {
  ["red", "yellow", "green"].forEach((status) => {
    const body = $(`[data-body="${status}"]`);
    const items = mails.filter((m) => m.status === status);
    body.innerHTML = items.map(noteHtml).join("");
    $(`[data-count-for="${status}"]`).textContent = items.length;
  });
  $$("#board .note").forEach((note) => note.addEventListener("click", () => selectMail(note.dataset.id)));
  renderCounts();
}

function renderCounts() {
  const red = mails.filter((m) => m.status === "red").length;
  const yellow = mails.filter((m) => m.status === "yellow").length;
  const green = mails.filter((m) => m.status === "green").length;
  $("#pillRed").textContent = `Rot · ${red}`;
  $("#pillYellow").textContent = `Gelb · ${yellow}`;
  $("#pillGreen").textContent = `Grün · ${green}`;
  $("#legendRed").textContent = red;
  $("#legendYellow").textContent = yellow;
  $("#legendGreen").textContent = green;
  $("#navInboxCount").textContent = red + yellow + green;
  $("#navOutboxCount").textContent = outbox.length;
  $("#navPhoneCount").textContent = mails.filter((m) => m.phone).length;
  $("#navCalCount").textContent = calendarEvents.length;
  $("#navCustomerCount").textContent = new Set(mails.map((m) => m.sender)).size;
}

/* ═══════════════════ RENDERING: KALENDER ═══════════════════ */

function renderCalendar() {
  const grid = $("#calendarGrid");
  const days = ["Mo 02.06.", "Di 03.06.", "Mi 04.06.", "Do 05.06.", "Fr 06.06."];
  const hours = ["09:00", "11:00", "13:00"];
  let html = `<div class="calendar-head"></div>` + days.map((d) => `<div class="calendar-head">${d}</div>`).join("");
  hours.forEach((hour, row) => {
    html += `<div class="hour">${hour}</div>`;
    for (let day = 0; day < 5; day++) {
      const ev = calendarEvents.find((e) => e.day === day && e.row === row);
      if (ev) {
        const linked = mails.find((m) => m.id === ev.mail && m.id === state.selected) ? " linked" : "";
        html += `<div class="slot"><button class="event${linked}" data-mail="${ev.mail}"><strong>${esc(ev.title)}</strong><span>${esc(ev.sub)}</span></button></div>`;
      } else {
        html += `<div class="slot"></div>`;
      }
    }
  });
  grid.innerHTML = html;
  $$("#calendarGrid .event").forEach((ev) => ev.addEventListener("click", () => selectMail(ev.dataset.mail, "inbox")));
}

function renderCalendarList() {
  const list = $("#calendarList");
  list.innerHTML = calendarEvents.map((ev) => {
    const linked = ev.mail === state.selected ? " linked" : "";
    return `<button class="calendar-item${linked}" data-mail="${ev.mail}"><strong>${esc(ev.when)}</strong><span>${esc(ev.title)}</span></button>`;
  }).join("");
  $$("#calendarList .calendar-item").forEach((item) => item.addEventListener("click", () => selectMail(item.dataset.mail, "inbox")));
}

/* ═══════════════════ RENDERING: TABELLEN ═══════════════════ */

function renderOutbox(markNew) {
  const body = $("#outboxBody");
  body.innerHTML = outbox.map((row, i) => {
    const tag = row.status === "sent" ? `<span class="tag green">Gesendet</span>` : `<span class="tag yellow">Entwurf</span>`;
    return `<tr data-mail="${row.mail || ""}" class="${markNew === i ? "new" : ""}">
      <td>${esc(row.to)}</td><td>${esc(row.subject)}</td><td>${tag}</td>
      <td>${esc(row.ki)}</td><td>${fmtNum(row.tokens)}</td><td>${esc(row.time)}</td></tr>`;
  }).join("");
  $$("#outboxBody tr").forEach((tr) => {
    tr.addEventListener("click", () => {
      const mail = mails.find((m) => m.id === tr.dataset.mail) ||
        mails.find((m) => tr.cells[0].textContent.includes(m.sender.split(" ")[0]));
      if (mail) selectMail(mail.id, "inbox");
    });
  });
}

function renderCustomers() {
  const body = $("#customersBody");
  const seen = new Set();
  const rows = mails.filter((m) => {
    if (seen.has(m.sender)) return false;
    seen.add(m.sender);
    return true;
  });
  const firms = {
    "Sabine Haupt": "Immobilien Haupt", "Dr. Klein Kanzlei": "Kanzlei Dr. Klein", "Müller & Partner": "Steuerbüro",
    "Nordlicht Service": "Servicebetrieb", "Synlex Demo Lead": "Synlex UG", "Hansa Training": "Fahrschule",
    "Agentur West": "Agentur", "Thomas Berger": "Interessent", "Unbekannte Nummer": "–"
  };
  const statusTag = { red: `<span class="tag red">Manuell</span>`, yellow: `<span class="tag yellow">Prüfen</span>`, green: `<span class="tag green">Auto</span>`, sent: `<span class="tag blue">Erledigt</span>` };
  body.innerHTML = rows.map((m) => `
    <tr data-mail="${m.id}">
      <td>${esc(m.sender)}</td><td>${esc(firms[m.sender] || "KMU")}</td><td>${esc(m.channel)}</td>
      <td>${statusTag[m.status] || statusTag.sent}</td><td>${esc(m.subject)}</td></tr>`).join("");
  $$("#customersBody tr").forEach((tr) => tr.addEventListener("click", () => selectMail(tr.dataset.mail, "inbox")));
}

function renderPhoneCards() {
  const wrap = $("#phoneCards");
  wrap.innerHTML = mails.filter((m) => m.phone && m.status !== "sent").map(noteHtml).join("");
  $$("#phoneCards .note").forEach((note) => note.addEventListener("click", () => selectMail(note.dataset.id)));
}

/* ═══════════════════ RENDERING: DASHBOARD ═══════════════════ */

function renderChart() {
  const chart = $("#weekChart");
  const max = Math.max(...weekData.map((d) => d.value));
  chart.innerHTML = weekData.map((d, i) => `
    <div class="bar-col">
      <span class="bar-val">${d.value}</span>
      <div class="bar-fill" data-i="${i}" style="height:0"></div>
      <span class="bar-day">${d.day}</span>
    </div>`).join("");
  requestAnimationFrame(() => {
    $$("#weekChart .bar-fill").forEach((bar, i) => {
      bar.style.height = Math.round((weekData[i].value / max) * 120) + "px";
    });
  });
  const tip = $("#chartTooltip");
  $$("#weekChart .bar-fill").forEach((bar) => {
    bar.addEventListener("mousemove", (e) => {
      const d = weekData[+bar.dataset.i];
      tip.hidden = false;
      tip.textContent = `${d.day}: ${d.value} Vorgänge bearbeitet`;
      tip.style.left = e.clientX + 14 + "px";
      tip.style.top = e.clientY - 10 + "px";
    });
    bar.addEventListener("mouseleave", () => { tip.hidden = true; });
  });
}

function renderActivity(markNew) {
  const feed = $("#activityFeed");
  feed.innerHTML = activities.map((a, i) => `
    <button class="activity-item ${markNew === i ? "new" : ""}" data-mail="${a.mail}">
      <span class="act-text">${esc(a.text)}</span><span class="act-time">${esc(a.time)}</span>
    </button>`).join("");
  $$("#activityFeed .activity-item").forEach((item) => item.addEventListener("click", () => selectMail(item.dataset.mail, "inbox")));
}

function animateCounters() {
  $$("#kpiGrid [data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = +(el.dataset.decimals || 0);
    const dur = 900;
    const t0 = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals).replace(".", ",");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ═══════════════════ TOKEN-BUDGET ═══════════════════ */

function renderTokens() {
  const pct = Math.round((state.tokensUsed / state.tokensBudget) * 100);
  const left = state.tokensBudget - state.tokensUsed;
  $("#tokenRing").style.background = `conic-gradient(var(--brand-cyan) 0 ${pct}%, #d9f4f8 ${pct}% 100%)`;
  $("#tokenRingLabel").textContent = pct + "%";
  $("#tokenMiniUsed").textContent = `${fmtK(state.tokensUsed)} von 1,2M verbraucht`;
  $("#tokenMiniLeft").textContent = `${fmtK(left)} übrig`;
  $("#navTokenBadge").textContent = pct + "%";
  $("#tokenBigPercent").textContent = pct + "%";
  $("#tokenBar").style.width = pct + "%";
  $("#tokenUsedNum").textContent = fmtNum(state.tokensUsed);
  $("#tokenLeftNum").textContent = fmtNum(left);
}

/* ═══════════════════ AUSWAHL & DETAIL-PANEL ═══════════════════ */

let typeTimer = null;

function typewrite(el, text, speed = 6) {
  clearInterval(typeTimer);
  el.innerHTML = "";
  const caret = document.createElement("span");
  caret.className = "caret";
  caret.textContent = " ";
  const textNode = document.createTextNode("");
  el.appendChild(textNode);
  el.appendChild(caret);
  let i = 0;
  typeTimer = setInterval(() => {
    i = Math.min(text.length, i + 3);
    textNode.textContent = text.slice(0, i);
    if (i >= text.length) { clearInterval(typeTimer); caret.remove(); }
  }, speed);
}

const statusLabel = { red: ["Rot – Manuell", "red"], yellow: ["Gelb – Prüfen", "yellow"], green: ["Grün – Automatisch", "green"], sent: ["Gesendet", "blue"] };

function renderDetail(animate = true) {
  const mail = mails.find((m) => m.id === state.selected);
  if (!mail) return;
  const [label, cls] = statusLabel[mail.status] || statusLabel.sent;
  $("#detailMeta").innerHTML = `
    <span class="tag ${cls}">${label}</span>
    <span class="tag gray">${esc(mail.channel)}</span>
    <span class="tag blue">${mail.confidence}% Konfidenz</span>
    <span class="tag gray">~${fmtNum(mail.tokens)} Token</span>`;
  $("#detailTitle").textContent = mail.detail.title;
  $("#detailText").textContent = mail.detail.text;
  $("#reasonText").textContent = mail.detail.reason;
  cancelEdit();
  if (animate) typewrite($("#answerText"), mail.detail.answer);
  else $("#answerText").textContent = mail.detail.answer;
  const done = mail.status === "sent";
  $("#btnApprove").disabled = done;
  $("#btnApprove").textContent = done ? "✓ Gesendet" : "✓ Freigeben & Senden";
  $("#btnEdit").disabled = done;
  $("#btnSnooze").disabled = done;
  $("#btnManual").disabled = done || mail.status === "red";
}

function selectMail(mailId, gotoView) {
  const mail = mails.find((m) => m.id === mailId);
  if (!mail) return;
  state.selected = mailId;
  if (gotoView) showView(gotoView);
  $$(".note").forEach((n) => n.classList.toggle("selected", n.dataset.id === mailId));
  renderCalendarList();
  renderCalendar();
  renderDetail();
  const el = $(`.view.active .note[data-id="${mailId}"]`);
  if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

/* ═══════════════════ AKTIONEN ═══════════════════ */

function bump(sel) {
  const el = $(sel);
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 250);
}

function approveMail(id) {
  const mail = mails.find((m) => m.id === id);
  if (!mail || mail.status === "sent") return;
  const note = $(`.view.active .note[data-id="${id}"]`);
  const finish = () => {
    mail.status = "sent";
    outbox.unshift({ to: mail.sender, subject: "Re: " + mail.subject, status: "sent", ki: "KI-geprüft", tokens: mail.tokens, time: nowTime(), mail: mail.id });
    state.tokensUsed += mail.tokens;
    state.doneToday += 1;
    activities.unshift({ time: nowTime(), text: `Antwort an ${mail.sender} freigegeben & gesendet`, mail: mail.id });
    renderBoard(); renderOutbox(0); renderPhoneCards(); renderCustomers(); renderTokens(); renderActivity(0); renderDetail(false);
    bump("#navOutboxCount");
    toast("✓ Antwort gesendet", `Die Antwort an ${mail.sender} ist raus – dokumentiert im Postausgang.`, "success");
    audit(`Antwort an ${mail.sender} freigegeben & gesendet (Nutzer: A. Sänger)`);
  };
  if (note) { note.classList.add("leaving"); setTimeout(finish, 280); } else finish();
}

function snoozeMail(id) {
  const mail = mails.find((m) => m.id === id);
  if (!mail) return;
  mail.snoozed = !mail.snoozed;
  renderBoard(); renderPhoneCards();
  toast("⏰ Zurückgestellt", `„${mail.subject}“ wird morgen um 09:00 Uhr erneut vorgelegt.`, "warn");
  audit(`Vorgang „${mail.subject}“ zurückgestellt auf morgen 09:00`);
}

function manualMail(id) {
  const mail = mails.find((m) => m.id === id);
  if (!mail || mail.status === "red") return;
  mail.status = "red";
  renderBoard(); renderPhoneCards(); renderCustomers(); renderDetail(false);
  toast("✋ Auf Manuell gestellt", `„${mail.subject}“ wird jetzt persönlich bearbeitet.`, "danger");
  audit(`Vorgang „${mail.subject}“ manuell übernommen`);
}

function startEdit() {
  const mail = mails.find((m) => m.id === state.selected);
  if (!mail || mail.status === "sent") return;
  state.editing = true;
  $("#answerText").style.display = "none";
  $("#answerEdit").hidden = false;
  $("#answerTextarea").value = mail.detail.answer;
  $("#answerTextarea").focus();
}

function cancelEdit() {
  state.editing = false;
  $("#answerText").style.display = "";
  $("#answerEdit").hidden = true;
}

function saveEdit() {
  const mail = mails.find((m) => m.id === state.selected);
  if (!mail) return;
  mail.detail.answer = $("#answerTextarea").value;
  cancelEdit();
  $("#answerText").textContent = mail.detail.answer;
  toast("✎ Entwurf gespeichert", "Ihre Änderungen wurden übernommen – die KI lernt aus Ihrer Korrektur.", "success");
  audit(`Entwurf für „${mail.subject}“ manuell überarbeitet`);
}

/* ═══════════════════ VIEWS ═══════════════════ */

function showView(viewName) {
  $$("[data-view]").forEach((v) => v.classList.toggle("active", v.dataset.view === viewName));
  $$("[data-view-target]").forEach((b) => b.classList.toggle("active", b.dataset.viewTarget === viewName));
  const copy = viewCopy[viewName];
  if (copy) { $("#pageTitle").textContent = copy[0]; $("#pageSubtitle").textContent = copy[1]; }
  if (viewName === "dashboard") animateCounters();
}

/* ═══════════════════ TEST-MAIL & PIPELINE ═══════════════════ */

function runPipeline(onDone) {
  const steps = $$("#pipeline li");
  steps.forEach((s) => s.classList.remove("done", "working"));
  let i = 0;
  function next() {
    if (i > 0) { steps[i - 1].classList.remove("working"); steps[i - 1].classList.add("done"); }
    if (i >= steps.length) { onDone && onDone(); return; }
    steps[i].classList.add("working");
    i += 1;
    setTimeout(next, 650);
  }
  next();
}

function injectTestMail(from, subject, body) {
  const id = "test-" + Date.now();
  const short = body.length > 130 ? body.slice(0, 130) + "…" : body;
  mails.push({
    id, status: "yellow", tag: "Test-Mail", tagClass: "purple", time: nowTime(),
    subject, sender: from, channel: "E-Mail", preview: short, confidence: 84, cal: null, tokens: 1180,
    detail: {
      title: from,
      text: `${subject} – die Test-Mail wurde in den MVP-Ablauf eingespeist und als gelber Freigabe-Vorgang markiert.`,
      answer: "Guten Tag,\n\nvielen Dank für Ihre Nachricht. Five Fingers klassifiziert eingehende E-Mails, lädt passenden Kontext aus Kundendaten und Wissensbasis und bereitet daraus einen Antwortentwurf vor.\n\nGern schlage ich Ihnen einen kurzen Demo-Termin vor: Dienstag um 10:30 Uhr oder Donnerstag um 14:00 Uhr?\n\nHinweis: Diese E-Mail wurde mit Unterstützung von KI erstellt.\n\nFreundliche Grüße\nFive Fingers Demo-Team",
      reason: "Test-Mail erkannt. Absicht: Demo-/Informationsanfrage. Status Gelb, weil externe Antworten im MVP vor Versand freigegeben werden. Verbrauch: ~1.180 Token."
    }
  });
  activities.unshift({ time: nowTime(), text: `Neue Mail von ${from} klassifiziert: Gelb (84 %)`, mail: id });
  renderBoard(); renderCustomers(); renderActivity(0);
  bump("#navInboxCount");
  return id;
}

/* ═══════════════════ LIVE-DEMO ═══════════════════ */

function runLiveDemo() {
  if (state.demoRunning) return;
  state.demoRunning = true;
  const btn = $("#btnLiveDemo");
  btn.classList.add("running");
  btn.textContent = "● Demo läuft …";

  const seq = [
    [0, () => {
      showView("inbox");
      toast("▶ Live-Demo gestartet", "Szenario: Ein normaler Dienstagvormittag – schauen Sie zu.", "info");
    }],
    [1800, () => {
      toast("📥 Neue E-Mail", "Von: buero@steinberg-immobilien.de – „Besichtigungstermin Musterstraße 12?“", "info");
    }],
    [3400, () => {
      const id = injectTestMail("Steinberg Immobilien", "Besichtigungstermin Musterstraße 12", "Guten Tag, wir hätten Interesse an einer Besichtigung der Musterstraße 12. Geht bei Ihnen Donnerstag?");
      selectMail(id, "inbox");
      toast("🧠 KI-Analyse", "Intent: Terminwunsch · CRM-Kontext geladen · 84 % Konfidenz → Gelb", "warn");
      audit("Live-Demo: Mail von Steinberg Immobilien klassifiziert (Gelb, 84 %)");
    }],
    [7200, () => {
      toast("📞 Anruf nach Feierabend", "Der Telefon-Assistent nimmt an, transkribiert und erstellt einen Vorgang.", "info");
      audit("Live-Demo: Anruf angenommen & transkribiert");
    }],
    [9200, () => {
      selectMail("m8", "phone");
    }],
    [11600, () => {
      selectMail("m6", "inbox");
      toast("🟢 Automatik-Regel greift", "Standardfrage der Fahrschule erkannt – die KI darf laut Regel senden.", "success");
    }],
    [13600, () => {
      approveMail("m6");
    }],
    [15800, () => {
      showView("dashboard");
      toast("✓ Live-Demo beendet", "Drei Kanäle, ein Kontext, volle Kontrolle. Jetzt selbst klicken!", "success");
      state.demoRunning = false;
      btn.classList.remove("running");
      btn.textContent = "▶ Live-Demo";
    }]
  ];
  seq.forEach(([delay, fn]) => setTimeout(fn, delay));
}

/* ═══════════════════ TOUR ═══════════════════ */

let tourIndex = 0;

function showTourStep() {
  const step = tourSteps[tourIndex];
  $("#tourStepLabel").textContent = `Schritt ${tourIndex + 1} von ${tourSteps.length}`;
  $("#tourTitle").textContent = step.title;
  $("#tourText").textContent = step.text;
  $("#tourNext").textContent = tourIndex === tourSteps.length - 1 ? "Fertig ✓" : "Weiter →";
  showView(step.view);
}

function startTour() {
  tourIndex = 0;
  $("#tourOverlay").hidden = false;
  showTourStep();
}

function endTour() {
  $("#tourOverlay").hidden = true;
  showView("dashboard");
}

/* ═══════════════════ INIT & EVENTS ═══════════════════ */

$$("[data-view-target]").forEach((btn) => btn.addEventListener("click", () => showView(btn.dataset.viewTarget)));
$$("[data-goto]").forEach((btn) => btn.addEventListener("click", () => showView(btn.dataset.goto)));

$("#btnApprove").addEventListener("click", () => approveMail(state.selected));
$("#btnEdit").addEventListener("click", startEdit);
$("#btnSaveEdit").addEventListener("click", saveEdit);
$("#btnCancelEdit").addEventListener("click", cancelEdit);
$("#btnSnooze").addEventListener("click", () => snoozeMail(state.selected));
$("#btnManual").addEventListener("click", () => manualMail(state.selected));

$("#btnLiveDemo").addEventListener("click", runLiveDemo);
$("#btnTour").addEventListener("click", startTour);
$("#tourNext").addEventListener("click", () => {
  if (tourIndex >= tourSteps.length - 1) endTour();
  else { tourIndex += 1; showTourStep(); }
});
$("#tourSkip").addEventListener("click", endTour);

$("#btnSimulateCall").addEventListener("click", () => {
  const id = "call-" + Date.now();
  mails.push({
    id, status: "yellow", tag: "Telefon", tagClass: "yellow", time: nowTime(),
    subject: "Rückrufwunsch – Angebotsfrage", sender: "Petra Lindner", channel: "Telefon",
    preview: "Anruferin drückt 1. Sie möchte ein Angebot für 3 Standorte besprechen.", confidence: 86, cal: null, tokens: 1290, phone: true,
    detail: {
      title: "Telefon: Petra Lindner",
      text: "Simulierter Anruf bei besetzter Leitung. Die Anruferin hat 1 gedrückt und möchte einen Rückruf zum Thema Mehrstandort-Angebot.",
      answer: "Transkript:\n„Guten Tag, Lindner hier von der Lindner Gebäudeservice GmbH. Wir haben drei Standorte und würden gern über ein Angebot sprechen. Bitte um Rückruf am Nachmittag.“\n\nSystemaktion:\n– Rückrufwunsch erkannt (Nachmittag)\n– CRM: Neukontakt angelegt\n– Kalendervorschlag: heute 15:30 Uhr",
      reason: "Quelle: Telefon-Assistent (Simulation). Absicht: Rückruf + Angebotsanfrage. Status Gelb – Angebotsthemen werden laut Regelwerk vom Menschen freigegeben."
    }
  });
  activities.unshift({ time: nowTime(), text: "Telefon-Assistent: Anruf von Petra Lindner transkribiert", mail: id });
  renderBoard(); renderPhoneCards(); renderCustomers(); renderActivity(0);
  bump("#navPhoneCount");
  selectMail(id);
  toast("📞 Anruf angenommen", "Transkript erstellt, Rückrufwunsch erkannt – Vorgang liegt in der gelben Spalte.", "info");
  audit("Anruf von Petra Lindner angenommen & transkribiert");
});

$("#createSocialPlan").addEventListener("click", () => {
  const product = $("#socialProduct").value.trim() || "Five Fingers Core-Paket";
  const feed = $("#socialFeed");
  $("#socialIntro").textContent = "Die KI analysiert CRM-Daten, Zielgruppe und Produktinfos …";
  feed.innerHTML = `<div class="feed-item shimmer"><strong>⏳ Strategie wird erstellt …</strong><span>Zielgruppenprofil wird mit Kundenhistorie abgeglichen.</span></div>`;
  setTimeout(() => {
    $("#socialIntro").textContent = `Strategie für „${product}“: Vertrauen aufbauen, Schmerzpunkt zeigen, Demo als nächsten kleinen Schritt anbieten.`;
    feed.innerHTML = `
      <div class="feed-item"><strong>LinkedIn</strong><span>Fokus auf Entscheider: weniger Reaktionszeit, mehr Qualität, Mensch behält die Freigabe.</span></div>
      <div class="feed-item"><strong>Instagram / Facebook</strong><span>Vorher-nachher-Story: volle Inbox wird zur sortierten Ampel-Pinwand.</span></div>
      <div class="feed-item"><strong>Newsletter</strong><span>Vertrauensmail: KI antwortet nicht blind, sondern mit Kontext, Quellen und Freigabe.</span></div>`;
    toast("✨ Content-Strategie erstellt", "Drei Kanalvorschläge liegen bereit – Veröffentlichung erst nach Freigabe.", "success");
    audit(`Social-Media-Strategie für „${product}“ erzeugt`);
  }, 1400);
});

$("#testMailForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const from = $("#testFrom").value.trim() || "testkunde@example.de";
  const subject = $("#testSubject").value.trim() || "Test-Mail";
  const body = $("#testBody").value.trim() || "Bitte um Rückmeldung.";
  toast("📥 Test-Mail empfangen", "Die Pipeline verarbeitet die Mail – Schritt für Schritt.", "info");
  runPipeline(() => {
    const id = injectTestMail(from, subject, body);
    selectMail(id, "inbox");
    toast("🟡 Klassifiziert: Gelb", "Antwortentwurf liegt rechts zur Freigabe bereit (84 % Konfidenz).", "warn");
    audit(`Test-Mail von ${from} eingespeist & klassifiziert (Gelb)`);
  });
});

/* Seed-Audit-Log */
[
  "System gestartet – alle 5 Assistenten verbunden (Gmail, Kalender, Telefonie)",
  "Regelwerk geladen: 12 Automatik-Regeln, 4 Sperr-Regeln (Kanzlei, Preise, Beschwerden, Neukunden)",
  "Vorgang Agentur West automatisch abgeschlossen (Regel #7: Terminbestätigung)"
].forEach(audit);

/* Erst-Render */
renderBoard();
renderCalendar();
renderCalendarList();
renderOutbox();
renderCustomers();
renderPhoneCards();
renderChart();
renderActivity();
renderTokens();
renderDetail(false);
animateCounters();
