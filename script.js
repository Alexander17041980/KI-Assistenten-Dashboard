"use strict";

/* ═══════════════════════════ DATEN ═══════════════════════════ */

const state = {
  tokensBudget: 1200000,
  tokensUsed: 516000,
  selected: "m3",
  tone: "sachlich",
  editing: false,
  demoRunning: false
};

const mails = [
  {
    id: "m1", status: "red", tag: "Immobilien", tagClass: "red", time: "08:12",
    subject: "Exposé – falsche Wohnfläche", sender: "Sabine Haupt", channel: "E-Mail",
    preview: "118 m² ausgewiesen, tatsächlich 94 m². Schadensersatz gefordert.",
    confidence: 96, cal: "c1", tokens: 1420,
    attachments: [{ kind: "crm", name: "CRM-Notiz: Sabine Haupt", meta: "Bestandskundin · 2 Vorgänge" }],
    detail: {
      title: "Sabine Haupt",
      text: "Exposé-Beschwerde mit Schadensersatzforderung. Der Vorgang bleibt rot und wird persönlich bearbeitet.",
      answer: "Keine automatische Antwort.\n\nVorschlag der KI: persönliche Entschuldigung, Sachverhalt prüfen, Rückruftermin anbieten. Zuständig: Alexander Sänger.",
      reason: "Kritische Begriffe erkannt: „falsche Wohnfläche“, „Schadensersatz“. Status Rot, weil ein Haftungsrisiko besteht – hier entscheidet immer ein Mensch."
    },
    crm: { firma: "Immobilien Haupt", kontakt: "Sabine Haupt", seit: "2023", umsatz: "2 Objekte vermittelt",
      timeline: [{ t: "08:12", e: "E-Mail: Beschwerde Wohnfläche (Risiko → Rot)" }, { t: "vor 3 Wo.", e: "Exposé Musterstraße versendet" }, { t: "vor 2 Mon.", e: "Erstkontakt über Website" }] }
  },
  {
    id: "m2", status: "red", tag: "Kanzlei", tagClass: "red", time: "09:18",
    subject: "Vertragsfall mit Anhang", sender: "Dr. Klein Kanzlei", channel: "E-Mail",
    preview: "Sensibler Vorgang. KI darf zusammenfassen, aber nicht automatisch senden.",
    confidence: 91, cal: "c2", tokens: 1980,
    attachments: [{ kind: "pdf", name: "Vertragsentwurf_2026.pdf", meta: "14 Seiten · vertraulich" }, { kind: "crm", name: "CRM-Notiz: Dr. Klein Kanzlei", meta: "Kanzlei · Sperr-Regel" }],
    detail: {
      title: "Dr. Klein Kanzlei",
      text: "Sensibler Vertragsfall mit Anhang. Die KI darf zusammenfassen, aber nicht automatisch senden.",
      answer: "Zusammenfassung des 14-seitigen Anhangs liegt bereit.\n\nVersand einer Antwort erst nach juristischer Freigabe durch Ralph Kleemann (Legal & Compliance).",
      reason: "Rechtlich sensibler Kontext und Anhang erkannt. Status Rot – definierte Regel: Kanzlei-Vorgänge nie automatisch beantworten."
    },
    crm: { firma: "Kanzlei Dr. Klein", kontakt: "Dr. R. Klein", seit: "2024", umsatz: "Rahmenvertrag",
      timeline: [{ t: "09:18", e: "E-Mail mit Vertragsanhang (Sperr-Regel → Rot)" }, { t: "vor 1 Wo.", e: "Telefonat: Fristsache besprochen" }] }
  },
  {
    id: "m3", status: "yellow", tag: "Steuerbüro", tagClass: "yellow", time: "10:30",
    subject: "Erstgespräch – Terminanfrage", sender: "Müller & Partner", channel: "E-Mail",
    preview: "Kunde möchte drei Terminvorschläge. KI hat Slots vorbereitet.",
    confidence: 82, cal: "c3", tokens: 1240,
    attachments: [{ kind: "crm", name: "CRM-Notiz: Müller & Partner", meta: "Neukontakt · Lead" }],
    detail: {
      title: "Müller & Partner",
      text: "Terminwunsch für ein Erstgespräch. Die KI hat den Kalender geprüft und drei freie Slots in einen Antwortentwurf übernommen.",
      answer: "Guten Tag Frau Müller,\n\nvielen Dank für Ihre Nachricht. Gern schlage ich Ihnen drei freie Termine für ein Erstgespräch vor:\n\n– Dienstag, 09.06., 10:30 Uhr\n– Mittwoch, 10.06., 14:00 Uhr\n– Freitag, 12.06., 09:00 Uhr\n\nBitte teilen Sie uns kurz mit, welcher Termin für Sie passt.\n\nFreundliche Grüße\nFive Fingers Demo-Team",
      reason: "Erkannte Absicht: Terminwunsch. CRM-Kontext vorhanden, Kalender geprüft, keine kritischen Begriffe. Status Gelb, weil Erstkontakte laut Regelwerk freigegeben werden."
    },
    crm: { firma: "Steuerbüro Müller & Partner", kontakt: "Frau Müller", seit: "Neukontakt", umsatz: "–",
      timeline: [{ t: "10:30", e: "E-Mail: Terminanfrage (→ Gelb)" }, { t: "10:30", e: "Kalender: 3 freie Slots gefunden" }] }
  },
  {
    id: "m4", status: "yellow", tag: "Angebot", tagClass: "yellow", time: "11:05",
    subject: "Rückfrage zum Core-Paket", sender: "Nordlicht Service", channel: "E-Mail",
    preview: "Antwort passt, aber Preisdetail soll vor Versand geprüft werden.",
    confidence: 76, cal: "c4", tokens: 1080,
    attachments: [{ kind: "pdf", name: "Angebot_Core-Paket.pdf", meta: "Angebot · 1 Seite" }, { kind: "crm", name: "CRM-Notiz: Nordlicht Service", meta: "Interessent · Angebotsphase" }],
    detail: {
      title: "Nordlicht Service",
      text: "Rückfrage zum Core-Paket. Die Antwort ist vorbereitet, ein Preisdetail soll vor Versand bestätigt werden.",
      answer: "Guten Tag,\n\nvielen Dank für Ihre Rückfrage. Anbei die Angaben zum Core-Paket:\n\n– Einrichtung: einmalig 25.000 €\n– Lizenz: ab 299 €/Monat\n– Inklusive Betreuung und laufendem Betrieb\n\nDie markierte Preisposition bitte vor Versand bestätigen.\n\nFreundliche Grüße",
      reason: "Preis- und Angebotskontext erkannt. Status Gelb, weil ein wirtschaftliches Detail betroffen ist – Zahlen gibt immer ein Mensch frei."
    },
    crm: { firma: "Nordlicht Service GmbH", kontakt: "Herr Petersen", seit: "2026", umsatz: "Angebot offen",
      timeline: [{ t: "11:05", e: "E-Mail: Rückfrage Core-Paket (→ Gelb, Preis)" }, { t: "vor 4 Tg.", e: "Angebot versendet" }, { t: "vor 1 Wo.", e: "Demo-Gespräch geführt" }] }
  },
  {
    id: "m5", status: "yellow", tag: "Lead", tagClass: "purple", time: "12:44",
    subject: "Five Fingers Demo anfragen", sender: "Synlex Demo Lead", channel: "E-Mail",
    preview: "Demo-Termin und Kurzbeschreibung zum Core-Paket gewünscht.",
    confidence: 79, cal: "c5", tokens: 1150,
    attachments: [{ kind: "crm", name: "CRM-Notiz: Synlex Demo Lead", meta: "Neuer Lead · automatisch angelegt" }],
    detail: {
      title: "Synlex Demo Lead",
      text: "Demo-Anfrage und Wunsch nach kurzer Produktbeschreibung – als Lead im CRM angelegt.",
      answer: "Guten Tag,\n\ngern zeigen wir Ihnen Five Fingers in einer kurzen Demo. Ich schlage Ihnen Dienstag, 13:00 Uhr vor und sende vorab die wichtigsten Eckdaten zum Core-Paket.\n\nFreundliche Grüße",
      reason: "Lead-Kommunikation mit Vertriebschance. Status Gelb, weil Erstkontakt freigegeben werden soll. Lead wurde automatisch im CRM angelegt."
    },
    crm: { firma: "Synlex UG", kontakt: "Demo-Interessent", seit: "heute", umsatz: "Lead",
      timeline: [{ t: "12:44", e: "E-Mail: Demo-Anfrage (→ Gelb)" }, { t: "12:44", e: "Lead automatisch im CRM angelegt" }] }
  },
  {
    id: "m6", status: "green", tag: "Fahrschule", tagClass: "green", time: "13:10",
    subject: "Intensivkurs – Terminfrage", sender: "Hansa Training", channel: "E-Mail",
    preview: "Standardfrage zu Preisen, Dauer und nächsten freien Terminen.",
    confidence: 95, cal: "c6", tokens: 920,
    attachments: [{ kind: "pdf", name: "Kursangebot_Intensivkurs.pdf", meta: "Preisliste · 1 Seite" }, { kind: "crm", name: "CRM-Notiz: Hansa Training", meta: "Stammkunde · Auto-Regel" }],
    detail: {
      title: "Hansa Training",
      text: "Standardfrage zu Preisen, Dauer und nächsten Terminen – von der Wissensbasis vollständig abgedeckt.",
      answer: "Guten Tag,\n\nvielen Dank für Ihre Anfrage. Der nächste Intensivkurs startet am Freitag. Preise, Dauer und freie Plätze sende ich Ihnen anbei.\n\nFreundliche Grüße",
      reason: "Standard-FAQ mit 95 % Konfidenz, Antwort vollständig aus geprüfter Wissensbasis. Status Grün – Versand nach definierter Regel erlaubt."
    },
    crm: { firma: "Fahrschule Hansa Training", kontakt: "Sekretariat", seit: "2022", umsatz: "monatl. Kursanfragen",
      timeline: [{ t: "13:10", e: "E-Mail: Intensivkurs-Anfrage (→ Grün, FAQ)" }, { t: "letzte Wo.", e: "3 Kursanfragen automatisch beantwortet" }] }
  },
  {
    id: "m7", status: "green", tag: "Service", tagClass: "blue", time: "14:02",
    subject: "Termin bestätigt", sender: "Agentur West", channel: "E-Mail",
    preview: "Termin wurde bestätigt, Kalendereintrag bleibt sichtbar.",
    confidence: 93, cal: "c7", tokens: 680,
    attachments: [{ kind: "crm", name: "CRM-Notiz: Agentur West", meta: "Kunde · Termin bestätigt" }],
    detail: {
      title: "Agentur West",
      text: "Terminbestätigung ohne Risiko – Kalendereintrag wurde automatisch erstellt.",
      answer: "Der Termin wurde bestätigt und in den Kalender eingetragen. Die Bestätigung ist im Postausgang dokumentiert.",
      reason: "Terminbestätigung ohne offene Fragen. Status Grün – vollständig automatisch nach Regelwerk erledigt."
    },
    crm: { firma: "Agentur West", kontakt: "Projektleitung", seit: "2025", umsatz: "laufender Vertrag",
      timeline: [{ t: "14:02", e: "E-Mail: Terminbestätigung (→ Grün)" }, { t: "14:02", e: "Kalendereintrag Fr 06.06. angelegt" }] }
  },
  {
    id: "m8", status: "yellow", tag: "Telefon", tagClass: "yellow", time: "18:42",
    subject: "Rückrufwunsch nach Geschäftsschluss", sender: "Thomas Berger", channel: "Telefon",
    preview: "Anrufer drückt 1. Er möchte morgen einen Termin zur Five-Fingers-Demo.",
    confidence: 88, cal: "c8", tokens: 1310, phone: true,
    sysactions: ["Rückrufwunsch erkannt (Option 1)", "Kalender: morgen 10:30 Uhr vorgeschlagen", "CRM: Kontakt „Thomas Berger“ angelegt", "E-Mail-Assistent: Bestätigung vorbereitet"],
    attachments: [{ kind: "crm", name: "CRM-Notiz: Thomas Berger", meta: "Neukontakt aus Anruf" }],
    detail: {
      title: "Telefon: Thomas Berger",
      text: "Anruf nach Geschäftsschluss. Der Anrufer hat 1 gedrückt und möchte einen Rückruf mit Demo-Termin.",
      answer: "Transkript:\n„Guten Abend, hier ist Thomas Berger. Ich habe Five Fingers gesehen und würde gern morgen mit Alexander Sänger sprechen. Am besten vormittags. Bitte rufen Sie mich zurück.“\n\nSystemaktion:\n– Rückrufwunsch erkannt\n– Kalenderfenster morgen 10:30 Uhr vorgeschlagen\n– Kontakt im CRM angelegt\n– E-Mail-Assistent bereitet schriftliche Bestätigung vor",
      reason: "Quelle: Telefon-Assistent. Absicht: Rückruf + Terminwunsch. Status Gelb, weil der Termin vor finaler Bestätigung geprüft werden soll."
    },
    crm: { firma: "Interessent (Telefon)", kontakt: "Thomas Berger", seit: "heute", umsatz: "Lead",
      timeline: [{ t: "18:42", e: "Anruf angenommen (nach Feierabend)" }, { t: "18:42", e: "Transkript erstellt, Rückruf erkannt (→ Gelb)" }, { t: "18:42", e: "Kalender + CRM automatisch befüllt" }] }
  },
  {
    id: "m9", status: "red", tag: "Telefon", tagClass: "red", time: "19:08",
    subject: "Beschwerde auf Mailbox", sender: "Unbekannte Nummer", channel: "Telefon",
    preview: "Anrufer drückt 2. Tonfall verärgert, bittet um interne Klärung.",
    confidence: 94, cal: "c9", tokens: 1180, phone: true,
    sysactions: ["Kein Rückruf gewünscht (Option 2)", "Negative Stimmung erkannt → Rot", "Alexander Sänger wird informiert", "Kein automatischer Versand"],
    attachments: [{ kind: "crm", name: "CRM-Notiz: Unbekannte Nummer", meta: "Beschwerde · manuell" }],
    detail: {
      title: "Telefon: Unbekannte Nummer",
      text: "Anruf nach Geschäftsschluss. Der Anrufer hat 2 gedrückt – kein Rückruf gewünscht, Inhalt aber kritisch.",
      answer: "Transkript:\n„Ich wollte nur mitteilen, dass ich seit Tagen auf eine Antwort warte. Bitte Alexander informieren. Kein Rückruf nötig, aber das sollte intern geklärt werden.“\n\nSystemaktion:\n– Kein Rückruf angelegt\n– Alexander wird informiert\n– Vorgang landet rot auf der Ampel-Pinwand",
      reason: "Quelle: Telefon-Assistent. Kritische Stimmung und Beschwerde erkannt. Status Rot, weil menschliche Klärung notwendig ist."
    },
    crm: { firma: "Unbekannt (Telefon)", kontakt: "—", seit: "—", umsatz: "—",
      timeline: [{ t: "19:08", e: "Anruf: Beschwerde auf Mailbox" }, { t: "19:08", e: "Stimmung negativ → Rot, kein Auto-Versand" }] }
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

const docs = {
  "Angebot_Core-Paket.pdf": { title: "Angebot – Five Fingers Core-Paket", rows: [["Einrichtung & Integration (einmalig)", "25.000 €"], ["Lizenz Core-Paket (monatlich)", "299 €"], ["Betreuung & laufender Betrieb", "inklusive"], ["Zusätzliche Standorte (optional)", "auf Anfrage"]], total: "25.000 € einmalig + 299 €/Monat", note: "Preise netto zzgl. USt. Angebot freibleibend, gültig 30 Tage. Markierte Position vor Versand bestätigen." },
  "Kursangebot_Intensivkurs.pdf": { title: "Kursangebot – Führerschein-Intensivkurs", rows: [["Grundgebühr", "199 €"], ["Intensivkurs Klasse B (14 Tage)", "1.290 €"], ["Fahrstunde (45 Min.)", "59 €"], ["Nächster Start", "Freitag · 4 freie Plätze"]], total: "ab 1.489 € · nächster Start Freitag", note: "Alle Preise inkl. Lernmaterial. Prüfungsgebühren TÜV separat. Anmeldung online oder telefonisch." },
  "Vertragsentwurf_2026.pdf": { title: "Vertragsentwurf 2026 (vertraulich)", rows: [["Dokument", "Rahmenvertrag Entwurf"], ["Seiten", "14"], ["Status", "Juristische Prüfung ausstehend"], ["KI-Aktion", "Zusammenfassung – KEIN Auto-Versand"]], total: "Sperr-Regel aktiv – manuelle Freigabe erforderlich", note: "Inhalt vertraulich. Die KI darf zusammenfassen, aber nicht antworten. Freigabe: Legal & Compliance." }
};

const socialStrategies = {
  handwerk: {
    headline: "Meisterbetrieb Gas · Wasser · Heizung",
    intro: "Zielgruppen aus dem CRM: Eigenheimbesitzer 45+, Hausverwaltungen und junge Familien. Fokus-Aktion wird pro Kanal zielgruppengerecht ausgespielt.",
    posts: [
      { pf: "linkedin", aud: "Hausverwaltungen", text: "Heizungsausfall im Winter? Für Ihre Objekte zählt jede Stunde. Unser Wartungsvertrag sichert Reaktionszeiten unter 24 h – planbar, dokumentiert, DSGVO-konform abgerechnet.", tags: "#Facilitymanagement #Heizung #Wartung" },
      { pf: "instagram", aud: "Eigenheim 45+", text: "❄️ Bevor's kalt wird: Jetzt Heizungs-Check sichern. Unser Meisterteam war diese Woche bei Familie K. – neue Pumpe rein, 15 % weniger Verbrauch. Termin in 48 h.", tags: "#Heizungscheck #Handwerk #Energiesparen" },
      { pf: "facebook", aud: "Familien regional", text: "Kennen Sie das? Heizung tropft, keiner kommt. Bei uns bekommen Sie noch echte Termine – diese Woche 30 % schneller dank digitaler Terminplanung. 📞 Einfach anrufen.", tags: "#Klempner #vorOrt #Heizung" },
      { pf: "tiktok", aud: "Junge Hausbesitzer", text: "POV: Deine alte Heizung frisst Geld 💸 – 30-Sek-Clip: alt vs. neu, Verbrauch im Vergleich. „Bucht online in 2 Minuten.“ Trend-Sound + Vorher/Nachher.", tags: "#Heizung #Sanierung #fyp" },
      { pf: "newsletter", aud: "Bestandskunden", text: "Winter-Aktion: Heizungs-Check + Entlüftung zum Festpreis. Als Stammkunde 4 Wochen Vorlauf – Termine gehen schnell weg. Ein Klick zur Buchung.", tags: "Betreff: „Ihr Heizungs-Check – bevor es andere buchen“" }
    ]
  },
  immobilien: {
    headline: "Immobilien – Makler & Eigentümer",
    intro: "Zielgruppen aus dem CRM: Verkäufer von Bestandsimmobilien, Kapitalanleger und suchende Familien. Aktuelle Objekte werden je Kanal passend inszeniert.",
    posts: [
      { pf: "linkedin", aud: "Kapitalanleger", text: "Neu im Portfolio: 6-Parteien-Haus, 4,1 % Rendite, energetisch saniert. Für Anleger mit Weitblick – vollständige Unterlagen auf Anfrage, diskret.", tags: "#Kapitalanlage #Immobilien #Rendite" },
      { pf: "instagram", aud: "Familien", text: "🏡 Frisch gelistet: Reihenhaus mit Garten, 5 Min. zur Schule. Home-Staging-Bilder in der Story. Wer zuerst kommt, besichtigt zuerst – DM für Termin.", tags: "#Traumhaus #Eigenheim #Immobilie" },
      { pf: "facebook", aud: "Verkäufer 50+", text: "Sie überlegen zu verkaufen? Wir bewerten Ihre Immobilie kostenlos und ehrlich – mit echten Marktdaten aus Ihrer Straße. Unverbindlich anfragen.", tags: "#Immobilienverkauf #Wertermittlung" },
      { pf: "tiktok", aud: "Erstkäufer", text: "3 Fehler beim ersten Hauskauf 🏠 – 20-Sek-Clip. „Nr. 2 kostet die meisten Käufer 10.000 €.“ Schnelle Cuts, Makler spricht direkt in die Kamera.", tags: "#Hauskauf #ImmoTok #fyp" },
      { pf: "newsletter", aud: "Suchprofil-Kunden", text: "Ihr Suchprofil trifft auf 2 neue Objekte. Bevor sie online gehen: exklusiver Vorabzugang für unsere Newsletter-Kunden. Jetzt Besichtigung sichern.", tags: "Betreff: „2 neue Objekte passen zu Ihrer Suche“" }
    ]
  },
  fahrschule: {
    headline: "Fahrschule – Privatkunden & Eltern",
    intro: "Zielgruppen aus dem CRM: Fahranfänger 17–19, Eltern und Wiedereinsteiger. Intensivkurs-Aktion wird jugend- und elterngerecht getrennt ausgespielt.",
    posts: [
      { pf: "instagram", aud: "Fahranfänger 17–19", text: "🚗 In 14 Tagen zum Lappen! Intensivkurs mit fixem Prüfungstermin. Diese Woche 4 Plätze frei. Swipe für die Erfolgsquote (94 % 1. Versuch).", tags: "#Führerschein #Fahrschule #Intensivkurs" },
      { pf: "tiktok", aud: "Gen Z", text: "Fahrstunde-Fails, die jeder kennt 😂 – dann: „Bei uns übst du genau das, bis es sitzt.“ Trend-Audio, Fahrlehrer als Sidekick. CTA: online anmelden.", tags: "#Fahrschule #Führerschein #fyp" },
      { pf: "facebook", aud: "Eltern", text: "Liebe Eltern: sicher ans Ziel statt monatelang warten. Unser Intensivkurs bringt Ihr Kind in 14 Tagen zur Prüfung – transparente Preise, feste Termine.", tags: "#Fahrschule #Elternratgeber" },
      { pf: "newsletter", aud: "Wartelisten-Kontakte", text: "Ein Platz ist frei geworden: Intensivkurs Start Freitag. Als Erstes auf der Warteliste – 24 h Reservierung für Sie. Jetzt zusagen.", tags: "Betreff: „Ihr Intensivkurs-Platz ist frei“" }
    ]
  }
};

const processes = {
  email: { icon: "✉️", title: "E-Mail-Assistent bei der Arbeit", sub: "So verarbeitet Five Fingers eine eingehende E-Mail – Schritt für Schritt aus dem CRM heraus.",
    steps: [["Empfang", "Mail kommt über die Gmail-API herein"], ["Klassifizierung", "Intent, Dringlichkeit & Risiko werden erkannt"], ["CRM-Kontext", "Kundenakte & Historie werden geladen"], ["Wissensbasis", "Passende Bausteine & Preise abgeglichen (3 Treffer)"], ["Entwurf", "Antwort formuliert – mit Begründung & Quelle"], ["Ampel", "Vorgang landet rot/gelb/grün auf der Pinwand"]] },
  phone: { icon: "📞", title: "Telefon-Assistent bei der Arbeit", sub: "So verarbeitet der Assistent einen Anruf nach Feierabend – bis zum fertigen Vorgang.",
    steps: [["Anruf annehmen", "Ansage abgespielt, 1 = Rückruf / 2 = Info"], ["Transkription", "Speech-to-Text erstellt das Transkript"], ["Intent & Stimmung", "Anliegen und Tonfall werden erkannt"], ["CRM-Abgleich", "Kontakt gesucht oder neu angelegt"], ["Kalender / Rückruf", "Terminfenster vorgeschlagen, Notiz erstellt"], ["Ampel", "Vorgang übergeben an die Pinwand"]] },
  social: { icon: "📣", title: "Social-Media-Assistent bei der Arbeit", sub: "So holt sich der Agent die Infos aus dem Unternehmen und erzeugt fertige Posts.",
    steps: [["Zielgruppen-Analyse", "CRM-Segmente & Kundenhistorie ausgewertet"], ["Produktdaten", "Aktuelle Angebote & Aktionen geladen"], ["Trend & Engagement", "Kanäle, beste Zeiten & Formate geprüft"], ["Content-Generierung", "Posts je Plattform & Zielgruppe formuliert"], ["Tonalität", "Sprache pro Kanal angepasst (seriös bis Gen Z)"], ["Freigabe-Queue", "Entwürfe warten auf Ihre Freigabe"]] }
};

const plans = [
  { name: "Starter", badge: "", setup: "25.000 €", mo: "99 €/Monat", desc: "Einstieg für kleine Teams – ein Kanal, klare Regeln.", feats: ["1 Kanal (E-Mail)", "200k Token / Monat", "Ampel-Logik & Audit-Log", "E-Mail-Support"], cta: "Starter wählen" },
  { name: "Business", badge: "Ihr Paket", featured: true, setup: "25.000 €", mo: "299 €/Monat", desc: "Der Allrounder für den Mittelstand.", feats: ["E-Mail + Telefon + Kalender", "1,2M Token / Monat", "CRM-Hub & Data Bridge", "Prioritäts-Support"], cta: "Aktives Paket" },
  { name: "Profi", badge: "", setup: "25.000 €", mo: "599 €/Monat", desc: "Alle fünf Finger inkl. Social-Media-Studio.", feats: ["Alle 5 Assistenten", "3M Token / Monat", "Social-Media-Studio", "SLA 99,5 %"], cta: "Auf Profi upgraden" },
  { name: "Enterprise", badge: "", setup: "ab 25.000 €", mo: "ab 999 €/Monat", desc: "Mehrere Standorte, eigene Modelle, individuelle Integrationen.", feats: ["Mehrstandort & SSO", "Token nach Bedarf", "Integrationen: DATEV · beA · BiPRO", "Dedizierter Ansprechpartner"], cta: "Kontakt aufnehmen" }
];

const viewCopy = {
  dashboard: ["Dashboard", "Alle Kanäle in einer Ansicht – E-Mail, Telefon und Kalender live."],
  inbox: ["Posteingang – E-Mail", "Nur E-Mails auf der Ampel-Pinwand. Neueste oben. Klick öffnet Entwurf, Anhänge & Begründung."],
  calendar: ["Kalender", "Grün markierte Termine stammen aus E-Mails/Anrufen. Klick auf einen Termin öffnet den Vorgang."],
  outbox: ["Postausgang", "Freigegebene KI-Antworten, Entwürfe und Token-Verbrauch – jede Zeile klickbar."],
  phone: ["Telefon-Assistent", "Nimmt Anrufe bei besetzt oder nach Feierabend an und übergibt sie als Vorgang an die Ampel."],
  social: ["Social-Media-Assistent", "CRM-Analyse, Verhaltenspsychologie und Content – fertige Posts pro Plattform und Zielgruppe."],
  customers: ["Kunden", "Klick auf einen Kunden spielt die komplette Kundenreise Schritt für Schritt ab."],
  tokens: ["KI & Pakete", "Ihr aktuelles Paket, Token-Verbrauch, alle Preise und – auf Wunsch – die technische Architektur."],
  testaccount: ["Test-Modus", "Speise eine Test-Mail ein und verfolge live, wie die KI-Pipeline sie verarbeitet."]
};

const tourSteps = [
  { view: "dashboard", title: "Ein Dashboard für alle Kanäle", text: "Hier laufen E-Mail, Telefon und Kalender zusammen – neueste Vorgänge oben. Über das Burger-Menü links blenden Sie die Navigation ein und aus, über die Seitenleiste filtern Sie auf einen einzelnen Kanal." },
  { view: "inbox", title: "Die Ampel-Pinwand", text: "Rot bearbeitet der Mensch, Gelb prüft der Mensch, Grün darf die KI nach Regeln erledigen. Klicken Sie eine Karte an – rechts erscheinen Entwurf, Anhänge und Begründung. Der Tonfall lässt sich live umschalten." },
  { view: "phone", title: "Telefon-Assistent", text: "Nach Feierabend nimmt der Assistent an, transkribiert und legt Kalender- und CRM-Eintrag an. Mit „Kunde zurückrufen“ planen Sie den Rückruf, mit ⚙ sehen Sie das Rädchen bei der Arbeit." },
  { view: "customers", title: "Kundenreise live", text: "Klick auf einen Kunden – die KI spielt den kompletten Vorgang ab: Anfrage, Klassifizierung, Kontext, Antwort, Termin, zufriedener Kunde. Perfekt für die Kundendemo." },
  { view: "social", title: "Social-Media-Studio", text: "Laden Sie in der CRM-Analyse und Verhaltenspsychologie eigene Dokumente hoch oder sprechen Sie ein, geben Sie ein eigenes Thema vor – und lassen Sie für eine neue Zielgruppe den ganzen Prozess neu laufen." },
  { view: "tokens", title: "Pakete & Preise", text: "Transparentes Abo-Modell: Starter, Business, Profi, Enterprise. Ihr aktueller Verbrauch oben, die technische Architektur einklappbar darunter." },
  { view: "dashboard", title: "Jetzt selbst ausprobieren", text: "Starten Sie oben die ▶ Live-Demo oder „✉ Anfrage simulieren“ – neue Vorgänge erscheinen sofort ganz oben im Dashboard." }
];

/* ═══════════════════════════ HELFER ═══════════════════════════ */

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
function esc(str) { return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function fmtK(n) { return n >= 1000000 ? (n / 1000000).toFixed(1).replace(".", ",") + "M" : Math.round(n / 1000) + "k"; }
function fmtNum(n) { return n.toLocaleString("de-DE"); }
function nowTime() { return new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }); }
function statusColor(s) { return { red: "var(--red)", yellow: "var(--yellow)", green: "var(--green)" }[s] || "var(--brand-cyan)"; }
function parseHM(t) { const m = /(\d{1,2}):(\d{2})/.exec(t || ""); return m ? (+m[1]) * 60 + (+m[2]) : 0; }
function tsOf(m) { return m.ts != null ? m.ts : parseHM(m.time); }

function toast(title, text, kind = "info") {
  const el = document.createElement("div");
  el.className = "toast " + (kind === "info" ? "" : kind);
  el.innerHTML = `<strong>${esc(title)}</strong>${esc(text)}`;
  $("#toastStack").appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 4200);
}
function audit(text) {
  const entry = document.createElement("div");
  entry.className = "audit-entry";
  entry.innerHTML = `<time>${nowTime()}</time><span>${esc(text)}</span>`;
  $("#auditLog").prepend(entry);
}

function toneVariant(base, tone) {
  if (tone === "persoenlich") {
    let out = base.replace(/^Guten Tag/, "Hallo").replace("Freundliche Grüße", "Herzliche Grüße");
    if (!/Transkript/.test(base)) out += "\n\nWenn es einfacher ist, rufe ich Sie auch kurz an – sagen Sie mir einfach Bescheid.";
    return out;
  }
  if (tone === "empathisch") {
    let out = base.replace(/^(Guten Tag[^\n]*\n|Hallo[^\n]*\n)/, "$1\nich kann gut nachvollziehen, dass Ihnen das Anliegen wichtig ist – vielen Dank, dass Sie sich bei uns melden.\n");
    out = out.replace("Freundliche Grüße", "Mit besten Grüßen und bis bald");
    return out;
  }
  return base;
}

/* ═══════════════════ BOARD-RENDERING ═══════════════════ */

const columns = [["red", "Manuell", "Persönlich bearbeiten"], ["yellow", "Prüfen", "Vor Senden kontrollieren"], ["green", "Automatisch", "KI darf nach Regeln senden"]];

function noteHtml(mail) {
  const sel = mail.id === state.selected ? " selected" : "";
  const snoozed = mail.snoozed ? " snoozed" : "";
  const link = mail.cal ? "Termin verknüpft" : (mail.phone ? "Transkript erstellt" : "");
  const attach = (mail.attachments || []).some(a => a.kind === "pdf") ? " 📎" : "";
  const chan = mail.phone ? `<span class="chan"><span class="ci">📞</span>Telefon</span>` : `<span class="chan"><span class="ci">✉️</span>E-Mail</span>`;
  return `
    <button class="note ${mail.status}${sel}${snoozed}" data-id="${mail.id}">
      <div class="note-top">${chan}<span class="time">${esc(mail.time)}</span></div>
      <strong class="subject">${esc(mail.subject)}${attach}</strong>
      <div class="sender">${esc(mail.sender)}</div>
      <p>${esc(mail.preview)}</p>
      <div class="confidence"><span style="color:${statusColor(mail.status)}">${mail.confidence}% Konfidenz</span><span class="calendar-link">${link}</span></div>
      <div class="conf-bar"><i style="width:${mail.confidence}%;background:${statusColor(mail.status)}"></i></div>
    </button>`;
}

function renderBoardInto(el, filterFn) {
  el.innerHTML = columns.map(([st, title, sub]) => {
    const items = mails.filter((m) => m.status === st && filterFn(m)).sort((a, b) => tsOf(b) - tsOf(a));
    return `<div class="column" data-status="${st}">
      <div class="column-head">
        <div class="column-title"><i class="dot dot-${st}"></i><div><strong>${title}</strong><span>${sub}</span></div></div>
        <span class="count count-${st}">${items.length}</span>
      </div>
      <div class="column-body">${items.map(noteHtml).join("")}</div>
    </div>`;
  }).join("");
  el.querySelectorAll(".note").forEach((n) => n.addEventListener("click", () => selectMail(n.dataset.id)));
}

function renderBoard() {
  renderBoardInto($("#boardAll"), () => true);
  renderBoardInto($("#boardInbox"), (m) => m.channel === "E-Mail");
  renderPhoneCards();
  renderCounts();
}

function colorBadges(target, subset) {
  const r = subset.filter(m => m.status === "red").length;
  const y = subset.filter(m => m.status === "yellow").length;
  const g = subset.filter(m => m.status === "green").length;
  target.innerHTML =
    `<span class="nb ${r ? "red" : "zero"}">${r}</span><span class="nb ${y ? "yellow" : "zero"}">${y}</span><span class="nb ${g ? "green" : "zero"}">${g}</span>`;
}

function renderCounts() {
  const open = mails.filter(m => ["red", "yellow", "green"].includes(m.status));
  colorBadges($("#navInbox"), open.filter(m => m.channel === "E-Mail"));
  colorBadges($("#navPhone"), open.filter(m => m.phone));
  $("#navOutboxCount").textContent = outbox.length;
  $("#navCalCount").textContent = calendarEvents.length;
  $("#navCustomerCount").textContent = new Set(mails.map(m => m.sender)).size;

  const red = open.filter(m => m.status === "red").length;
  const yellow = open.filter(m => m.status === "yellow").length;
  const hint = $("#alertHint");
  if (red > 0) { hint.className = "alert-hint"; hint.innerHTML = `⚠ ${red} Vorgang${red > 1 ? "e" : ""} brauchen Sie persönlich${yellow ? ` · ${yellow} zur Freigabe` : ""}.`; }
  else if (yellow > 0) { hint.className = "alert-hint calm"; hint.innerHTML = `✓ Nichts Kritisches – ${yellow} Vorgang${yellow > 1 ? "e" : ""} warten nur auf Ihre Freigabe.`; }
  else { hint.className = "alert-hint calm"; hint.innerHTML = "✓ Alles erledigt – kein offener Vorgang."; }
}

/* ═══════════════════ KALENDER ═══════════════════ */

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
        const linked = ev.mail === state.selected ? " linked" : "";
        html += `<div class="slot"><button class="event${linked}" data-mail="${ev.mail}"><strong>${esc(ev.title)}</strong><span>${esc(ev.sub)}</span></button></div>`;
      } else html += `<div class="slot"></div>`;
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

/* ═══════════════════ TABELLEN ═══════════════════ */

function renderOutbox() {
  const body = $("#outboxBody");
  body.innerHTML = outbox.map((row) => {
    const tag = row.status === "sent" ? `<span class="tag green">Gesendet</span>` : `<span class="tag yellow">Entwurf</span>`;
    return `<tr data-mail="${row.mail || ""}"><td>${esc(row.to)}</td><td>${esc(row.subject)}</td><td>${tag}</td><td>${esc(row.ki)}</td><td>${fmtNum(row.tokens)}</td><td>${esc(row.time)}</td></tr>`;
  }).join("");
  $$("#outboxBody tr").forEach((tr) => tr.addEventListener("click", () => {
    const mail = mails.find((m) => m.id === tr.dataset.mail) || mails.find((m) => tr.cells[0].textContent.includes(m.sender.split(" ")[0]));
    if (mail) selectMail(mail.id, "inbox");
  }));
}

const firms = {
  "Sabine Haupt": "Immobilien Haupt", "Dr. Klein Kanzlei": "Kanzlei Dr. Klein", "Müller & Partner": "Steuerbüro",
  "Nordlicht Service": "Servicebetrieb", "Synlex Demo Lead": "Synlex UG", "Hansa Training": "Fahrschule",
  "Agentur West": "Agentur", "Thomas Berger": "Interessent", "Unbekannte Nummer": "–"
};

function renderCustomers() {
  const body = $("#customersBody");
  const seen = new Set();
  const rows = mails.filter((m) => { if (seen.has(m.sender)) return false; seen.add(m.sender); return true; });
  const statusTag = { red: `<span class="tag red">Manuell</span>`, yellow: `<span class="tag yellow">Prüfen</span>`, green: `<span class="tag green">Auto</span>`, sent: `<span class="tag blue">Erledigt</span>` };
  body.innerHTML = rows.map((m) => `
    <tr data-mail="${m.id}"><td>${esc(m.sender)}</td><td>${esc(firms[m.sender] || "KMU")}</td><td>${esc(m.channel)}</td><td>${statusTag[m.status] || statusTag.sent}</td></tr>`).join("");
  $$("#customersBody tr").forEach((tr) => tr.addEventListener("click", () => playJourney(tr.dataset.mail)));
}

function renderPhoneCards() {
  const wrap = $("#phoneCards");
  const items = mails.filter((m) => m.phone && m.status !== "sent").sort((a, b) => tsOf(b) - tsOf(a));
  wrap.innerHTML = items.map(noteHtml).join("");
  $$("#phoneCards .note").forEach((note) => note.addEventListener("click", () => selectMail(note.dataset.id)));
}

/* ═══════════════════ KUNDENREISE ═══════════════════ */

function playJourney(mailId) {
  const mail = mails.find(m => m.id === mailId);
  if (!mail) return;
  $$("#customersBody tr").forEach(tr => tr.classList.toggle("active", tr.dataset.mail === mailId));
  $("#journeyIntro").textContent = `Vorgang von ${mail.sender} (${mail.channel}) – die KI arbeitet ihn Schritt für Schritt ab:`;
  const isPhone = !!mail.phone;
  const steps = [
    [isPhone ? "📞 Anruf / Anfrage" : "✉️ Anfrage empfangen", `${mail.sender} meldet sich: „${mail.subject}“`],
    ["🔎 Klassifizierung", `Intent & Risiko erkannt – Konfidenz ${mail.confidence}%`],
    ["🗂 CRM-Kontext geladen", `${firms[mail.sender] || "Kunde"} · ${mail.crm ? mail.crm.seit : "Neukontakt"}`],
    ["🧠 Antwort erstellt", "Entwurf mit Begründung vorbereitet (Human-in-the-Loop)"],
    ["📅 Termin / Aktion", mail.cal ? "Kalendereintrag verknüpft" : "Weitergabe an zuständige Person"],
    [mail.status === "red" ? "✋ An Mensch übergeben" : "😊 Kunde zufrieden", mail.status === "red" ? "Kritischer Fall – persönliche Bearbeitung" : "Schnelle, kontextgenaue Reaktion"]
  ];
  const j = $("#journey");
  j.innerHTML = steps.map((s, i) => `<div class="journey-step" data-j="${i}"><span class="js-ic">${i + 1}</span><span><strong>${esc(s[0])}</strong><span>${esc(s[1])}</span></span></div>`).join("");
  const els = $$("#journey .journey-step");
  let i = 0;
  (function run() {
    if (i > 0) { els[i - 1].classList.remove("on"); els[i - 1].classList.add("done"); els[i - 1].querySelector(".js-ic").textContent = "✓"; }
    if (i >= els.length) return;
    els[i].classList.add("on"); i += 1; setTimeout(run, 750);
  })();
}

/* ═══════════════════ DASHBOARD-KPI / CHART ═══════════════════ */

function animateCounters() {
  $$("#kpiGrid [data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = +(el.dataset.decimals || 0);
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / 900);
      el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals).replace(".", ",");
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  });
}

/* ═══════════════════ TOKEN / PAKETE ═══════════════════ */

function renderTokens() {
  const pct = Math.round((state.tokensUsed / state.tokensBudget) * 100);
  const left = state.tokensBudget - state.tokensUsed;
  $("#tokenRing").style.background = `conic-gradient(var(--brand-cyan) 0 ${pct}%, #d9f4f8 ${pct}% 100%)`;
  $("#tokenRingLabel").textContent = pct + "%";
  $("#tokenBar").style.width = pct + "%";
  $("#tokenUsedNum").textContent = fmtNum(state.tokensUsed);
  $("#tokenLeftNum").textContent = fmtNum(left) + " übrig";
}

function renderPricing() {
  $("#pricingGrid").innerHTML = plans.map((p) => `
    <div class="price-card ${p.featured ? "featured" : ""}">
      ${p.badge ? `<span class="price-badge">${esc(p.badge)}</span>` : ""}
      <div class="price-name">${esc(p.name)}</div>
      <div class="price-tag"><span class="setup">${esc(p.setup)}</span><span class="mo">+ ${esc(p.mo)}</span></div>
      <p class="price-desc">${esc(p.desc)}</p>
      <ul class="price-feats">${p.feats.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
      <button class="action ${p.featured ? "" : "primary"}" ${p.featured ? "disabled" : ""} data-plan="${esc(p.name)}">${esc(p.cta)}</button>
    </div>`).join("");
  $$("#pricingGrid .action:not([disabled])").forEach((b) => b.addEventListener("click", () => {
    toast("📦 Paket ausgewählt", `Anfrage für „${b.dataset.plan}“ notiert – unser Team meldet sich.`, "success");
    audit(`Paket-Interesse: ${b.dataset.plan}`);
  }));
}

/* ═══════════════════ DETAIL-PANEL ═══════════════════ */

let typeTimer = null;
function typewrite(el, text, speed = 6) {
  clearInterval(typeTimer);
  el.innerHTML = "";
  const caret = document.createElement("span"); caret.className = "caret"; caret.textContent = " ";
  const node = document.createTextNode(""); el.appendChild(node); el.appendChild(caret);
  let i = 0;
  typeTimer = setInterval(() => { i = Math.min(text.length, i + 3); node.textContent = text.slice(0, i); if (i >= text.length) { clearInterval(typeTimer); caret.remove(); } }, speed);
}

const statusLabel = { red: ["Rot – Manuell", "red"], yellow: ["Gelb – Prüfen", "yellow"], green: ["Grün – Automatisch", "green"], sent: ["Gesendet", "blue"] };
function currentAnswer(mail) { return toneVariant(mail.detail.answer, state.tone); }

function renderAttachments(mail) {
  const wrap = $("#attachments");
  wrap.innerHTML = (mail.attachments || []).map((a, i) => {
    const icon = a.kind === "pdf" ? "📄" : "🗂";
    return `<button class="attach-item" data-att="${i}"><span class="attach-icon">${icon}</span><span><strong>${esc(a.name)}</strong><span>${esc(a.meta)}</span></span></button>`;
  }).join("");
  $$("#attachments .attach-item").forEach((btn) => btn.addEventListener("click", () => openAttachment(mail, +btn.dataset.att)));
}

function renderDetail(animate = true) {
  const mail = mails.find((m) => m.id === state.selected);
  if (!mail) return;
  const [label, cls] = statusLabel[mail.status] || statusLabel.sent;
  $("#detailMeta").innerHTML = `<span class="tag ${cls}">${label}</span><span class="tag gray">${esc(mail.channel)}</span><span class="tag blue">${mail.confidence}% Konfidenz</span><span class="tag gray">~${fmtNum(mail.tokens)} Token</span>`;
  $("#detailTitle").textContent = mail.detail.title;

  let sysHtml = "";
  if (mail.sysactions) sysHtml = `<div class="sysactions">` + mail.sysactions.map(s => `<div class="sysaction"><span class="sa-ic">✓</span>${esc(s)}</div>`).join("") + `</div>`;
  $("#detailText").innerHTML = esc(mail.detail.text) + sysHtml;

  $("#reasonText").textContent = mail.detail.reason;
  renderAttachments(mail);

  $("#btnCallback").hidden = !mail.phone;
  $("#toneSwitch").style.display = mail.channel === "E-Mail" ? "" : "none";
  $$("#toneSwitch .tone-btn").forEach(b => b.classList.toggle("active", b.dataset.tone === state.tone));

  cancelEdit();
  const answer = currentAnswer(mail);
  if (animate) typewrite($("#answerText"), answer); else $("#answerText").textContent = answer;

  const done = mail.status === "sent";
  $("#btnApprove").disabled = done;
  $("#btnApprove").textContent = done ? "✓ Gesendet" : "✓ Freigeben & Senden";
  $("#btnEdit").disabled = done; $("#btnSnooze").disabled = done;
  $("#btnManual").disabled = done || mail.status === "red";
}

function selectMail(mailId, gotoView) {
  const mail = mails.find((m) => m.id === mailId);
  if (!mail) return;
  state.selected = mailId; state.tone = "sachlich";
  if (gotoView) showView(gotoView);
  $$(".note").forEach((n) => n.classList.toggle("selected", n.dataset.id === mailId));
  renderCalendarList(); renderCalendar(); renderDetail();
  const el = $(`.view.active .note[data-id="${mailId}"]`);
  if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function locateInBoard() {
  const id = state.selected;
  const mail = mails.find(m => m.id === id);
  const view = (mail && mail.channel === "E-Mail") ? "dashboard" : "dashboard";
  showView(view);
  setTimeout(() => {
    const el = $(`.view.active .note[data-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      el.classList.remove("pulse"); void el.offsetWidth; el.classList.add("pulse");
      const col = { red: "roten", yellow: "gelben", green: "grünen" };
      toast("🎯 Vorgang gefunden", `„${mail.subject}“ liegt in der ${col[mail.status] || ""} Spalte.`, "info");
    }
  }, 140);
}

/* ═══════════════════ MODAL ═══════════════════ */

function openModal(html, extraClass = "") { $("#modalBody").className = "modal-body " + extraClass; $("#modalBody").innerHTML = html; $("#modalOverlay").hidden = false; }
function closeModal() { $("#modalOverlay").hidden = true; if (gearTimer) { clearTimeout(gearTimer); gearTimer = null; } }
function openAttachment(mail, i) { const a = mail.attachments[i]; if (a.kind === "pdf") openDoc(a.name); else openCrm(mail); }
function openDocSheet(inner) { openModal(`<div class="doc-sheet">${inner}</div>`); }

function openDoc(name) {
  const d = docs[name] || { title: name, rows: [], total: "", note: "" };
  const rows = d.rows.map(r => `<tr><td>${esc(r[0])}</td><td style="text-align:right;font-weight:700">${esc(r[1])}</td></tr>`).join("");
  openDocSheet(`<div class="doc-brand"><div class="db-name">FIVE<span>FINGERS</span></div><div class="db-meta">Synlex UG · fivefingers.io<br>Dokument-Vorschau</div></div>
    <span class="doc-note-badge">📄 ${esc(name)}</span><h3>${esc(d.title)}</h3>
    <table class="doc-table"><tr><th>Position</th><th style="text-align:right">Betrag</th></tr>${rows}</table>
    <div class="doc-total">${esc(d.total)}</div><p style="margin-top:14px;color:#667085;font-size:12.5px">${esc(d.note)}</p>`);
}

function openCrm(mail) {
  const c = mail.crm || {};
  const tl = (c.timeline || []).map(e => `<div class="crm-event"><time>${esc(e.t)}</time><span>${esc(e.e)}</span></div>`).join("");
  openDocSheet(`<div class="doc-brand"><div class="db-name">CRM · Kundenakte</div><div class="db-meta">Five Fingers Data Bridge<br>DSGVO-konform</div></div>
    <span class="doc-note-badge">🗂 ${esc(mail.sender)}</span>
    <div style="margin-top:12px">
      <div class="crm-field"><span>Firma</span><div>${esc(c.firma || "–")}</div></div>
      <div class="crm-field"><span>Ansprechpartner</span><div>${esc(c.kontakt || "–")}</div></div>
      <div class="crm-field"><span>Kunde seit</span><div>${esc(c.seit || "–")}</div></div>
      <div class="crm-field"><span>Umsatz / Status</span><div>${esc(c.umsatz || "–")}</div></div>
      <div class="crm-field"><span>Kanal</span><div>${esc(mail.channel)}</div></div>
    </div><h3 style="margin-top:16px">Verlauf</h3><div class="crm-timeline">${tl}</div>`);
}

/* Zahnrad */
let gearTimer = null;
const GEAR_SVG = `<svg class="gear g1" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94a7.5 7.5 0 000-1.88l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.6-.22l-2.39.96a7 7 0 00-1.62-.94l-.36-2.54a.5.5 0 00-.5-.42h-3.84a.5.5 0 00-.5.42l-.36 2.54c-.58.24-1.12.55-1.62.94l-2.39-.96a.5.5 0 00-.6.22L2.68 8.84a.5.5 0 00.12.64l2.03 1.58a7.5 7.5 0 000 1.88l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32a.5.5 0 00.6.22l2.39-.96c.5.39 1.04.7 1.62.94l.36 2.54a.5.5 0 00.5.42h3.84a.5.5 0 00.5-.42l.36-2.54c.58-.24 1.12-.55 1.62-.94l2.39.96a.5.5 0 00.6-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"/></svg>`;

function openProcess(kind) {
  if (kind === "auto") { const mail = mails.find(m => m.id === state.selected); kind = mail && mail.phone ? "phone" : "email"; }
  const p = processes[kind] || processes.email;
  const steps = p.steps.map((s, i) => `<div class="process-step" data-ps="${i}"><span class="ps-ic">${i + 1}</span><span><strong>${esc(s[0])}</strong><span>${esc(s[1])}</span></span></div>`).join("");
  openModal(`<div class="process-modal"><div class="gear-stage">${GEAR_SVG}${GEAR_SVG.replace("g1", "g2")}${GEAR_SVG.replace("g1", "g3")}<div class="gear-center">${p.icon}</div></div><h2>${esc(p.title)}</h2><p>${esc(p.sub)}</p><div class="process-steps">${steps}</div></div>`);
  runGears(0);
}
function runGears(i) {
  const els = $$("#modalBody .process-step");
  if (!els.length) return;
  if (i > 0) { els[i - 1].classList.remove("on"); els[i - 1].classList.add("done"); els[i - 1].querySelector(".ps-ic").textContent = "✓"; }
  if (i >= els.length) { gearTimer = null; return; }
  els[i].classList.add("on");
  gearTimer = setTimeout(() => runGears(i + 1), 900);
}

/* Architektur */
const archInfo = {
  in: "<strong>Eingangskanäle:</strong> Office 365 / Gmail (Microsoft Graph & Gmail API), Telefonie, Social-Media-APIs und Kalender. Five Fingers liest, wo Sie schon arbeiten – ohne Datenmigration.",
  ai: "<strong>KI-Engine:</strong> Azure OpenAI (GPT-4o), modellagnostisch – kein Vendor-Lock-in. Klassifizierung nach Intent + Risiko, Kontext-Loader, Antwort-Generator, Ampel-Logik. Kosten transparent: ca. 0,04–0,46 € pro E-Mail.",
  hub: "<strong>CRM-Hub / Data Bridge:</strong> Pufferschicht zwischen Kanälen und Ihrem CRM. Kundenakte, Wissensbasis, Regelwerk und revisionssicheres Audit-Log. Serverstandort Azure Germany, DSGVO Art. 32.",
  out: "<strong>Operations-Dashboard:</strong> Ampel-Pinwand, Kalender, KPIs und die Freigabe-Schicht (Human-in-the-Loop). Nichts wird ohne Regel oder Freigabe versendet."
};
function renderArch() {
  $$("#archFlow .arch-layer").forEach((layer) => layer.addEventListener("click", () => {
    $$("#archFlow .arch-layer").forEach(l => l.classList.remove("active"));
    layer.classList.add("active"); $("#archDetail").innerHTML = archInfo[layer.dataset.arch] || "";
  }));
}

/* ═══════════════════ AKTIONEN ═══════════════════ */

function approveMail(id) {
  const mail = mails.find((m) => m.id === id);
  if (!mail || mail.status === "sent") return;
  const note = $(`.view.active .note[data-id="${id}"]`);
  const finish = () => {
    mail.status = "sent";
    outbox.unshift({ to: mail.sender, subject: "Re: " + mail.subject, status: "sent", ki: "KI-geprüft", tokens: mail.tokens, time: nowTime(), mail: mail.id });
    state.tokensUsed += mail.tokens;
    activities_push(`Antwort an ${mail.sender} freigegeben & gesendet`, mail.id);
    renderBoard(); renderOutbox(); renderCustomers(); renderTokens(); renderDetail(false);
    toast("✓ Antwort gesendet", `Die Antwort an ${mail.sender} ist raus – dokumentiert im Postausgang.`, "success");
    audit(`Antwort an ${mail.sender} freigegeben & gesendet (Nutzer: A. Sänger)`);
  };
  if (note) { note.classList.add("leaving"); setTimeout(finish, 280); } else finish();
}
function activities_push() { } // Aktivitätsfeed entfällt im v3-Dashboard

function snoozeMail(id) {
  const mail = mails.find((m) => m.id === id);
  if (!mail) return;
  mail.snoozed = !mail.snoozed;
  renderBoard();
  toast("⏰ Zurückgestellt", `„${mail.subject}“ wird morgen um 09:00 Uhr erneut vorgelegt.`, "warn");
  audit(`Vorgang „${mail.subject}“ zurückgestellt auf morgen 09:00`);
}
function manualMail(id) {
  const mail = mails.find((m) => m.id === id);
  if (!mail || mail.status === "red") return;
  mail.status = "red"; renderBoard(); renderCustomers(); renderDetail(false);
  toast("✋ Auf Manuell gestellt", `„${mail.subject}“ wird jetzt persönlich bearbeitet.`, "danger");
  audit(`Vorgang „${mail.subject}“ manuell übernommen`);
}
function callback() {
  const mail = mails.find(m => m.id === state.selected);
  if (!mail) return;
  toast("📞 Rückruf eingeplant", `${mail.sender} wird zurückgerufen – Termin im Kalender vermerkt.`, "success");
  audit(`Rückruf an ${mail.sender} eingeplant`);
}

function startEdit() {
  const mail = mails.find((m) => m.id === state.selected);
  if (!mail || mail.status === "sent") return;
  state.editing = true;
  $("#answerText").style.display = "none"; $("#answerEdit").hidden = false;
  $("#answerTextarea").value = currentAnswer(mail); $("#answerTextarea").focus();
}
function cancelEdit() { state.editing = false; $("#answerText").style.display = ""; $("#answerEdit").hidden = true; }
function saveEdit() {
  const mail = mails.find((m) => m.id === state.selected);
  if (!mail) return;
  mail.detail.answer = $("#answerTextarea").value; state.tone = "sachlich";
  cancelEdit(); $("#answerText").textContent = mail.detail.answer;
  $$("#toneSwitch .tone-btn").forEach(b => b.classList.toggle("active", b.dataset.tone === "sachlich"));
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

/* ═══════════════════ SOCIAL-MEDIA ═══════════════════ */

const pfMeta = { linkedin: ["LinkedIn", "in"], instagram: ["Instagram", "◎"], facebook: ["Facebook", "f"], tiktok: ["TikTok", "♪"], newsletter: ["Newsletter", "✉"] };

function socialPostHtml(p, i, delay) {
  const [name, ic] = pfMeta[p.pf] || ["Kanal", "•"];
  return `<div class="social-post" style="animation-delay:${delay}ms">
    <div class="social-post-head pf-${p.pf}"><span>${ic}</span>${esc(name)}<span class="aud">${esc(p.aud)}</span></div>
    <div class="social-post-body"><p>${esc(p.text)}</p><div class="hashtags">${esc(p.tags)}</div></div>
    <div class="social-post-foot"><button data-act="approve">✓ Freigeben &amp; planen</button><button data-act="edit">✎ Anpassen</button></div></div>`;
}
function wireSocialFoot() {
  $$("#socialFeed .social-post").forEach((card) => {
    const p = card.querySelector("p");
    const approveBtn = card.querySelector('[data-act="approve"]');
    const editBtn = card.querySelector('[data-act="edit"]');
    editBtn.addEventListener("click", () => {
      const editing = p.getAttribute("contenteditable") === "true";
      if (!editing) {
        p.setAttribute("contenteditable", "true");
        p.classList.add("editing");
        p.focus();
        // Cursor ans Ende setzen
        const r = document.createRange(); r.selectNodeContents(p); r.collapse(false);
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        editBtn.textContent = "✓ Speichern";
        approveBtn.disabled = true;
      } else {
        p.setAttribute("contenteditable", "false");
        p.classList.remove("editing");
        editBtn.textContent = "✎ Anpassen";
        approveBtn.disabled = false;
        toast("✎ Angepasst", "Der Beitragstext wurde direkt im Post übernommen.", "info");
        audit("Social-Post inline bearbeitet");
      }
    });
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); editBtn.click(); }
    });
    approveBtn.addEventListener("click", () => {
      if (approveBtn.disabled) return;
      approveBtn.classList.add("approved"); approveBtn.textContent = "✓ Eingeplant";
      toast("✓ Post eingeplant", "Der Beitrag wurde zur Freigabe-Queue hinzugefügt.", "success");
    });
  });
}
function renderSocialPlan(branche, product) {
  const strat = socialStrategies[branche];
  $("#socialHeadline").textContent = "Strategie – " + strat.headline;
  $("#socialIntro").textContent = strat.intro + (product ? ` Aktuelles Thema: „${product}“.` : "");
  $("#socialFeed").innerHTML = strat.posts.map((p, i) => socialPostHtml(p, i, i * 70)).join("");
  wireSocialFoot();
}

/* ═══════════════════ TEST-MAIL & PIPELINE ═══════════════════ */

function runPipeline(onDone) {
  const steps = $$("#pipeline li");
  steps.forEach((s) => s.classList.remove("done", "working"));
  let i = 0;
  (function next() {
    if (i > 0) { steps[i - 1].classList.remove("working"); steps[i - 1].classList.add("done"); }
    if (i >= steps.length) { onDone && onDone(); return; }
    steps[i].classList.add("working"); i += 1; setTimeout(next, 650);
  })();
}

function injectTestMail(from, subject, body) {
  const id = "test-" + Date.now();
  const short = body.length > 130 ? body.slice(0, 130) + "…" : body;
  mails.push({
    id, ts: Date.now(), status: "yellow", tag: "Test-Mail", tagClass: "purple", time: nowTime(),
    subject, sender: from, channel: "E-Mail", preview: short, confidence: 84, cal: null, tokens: 1180,
    attachments: [{ kind: "crm", name: "CRM-Notiz: " + from, meta: "Neukontakt aus Test-Mail" }],
    detail: {
      title: from,
      text: `${subject} – die Test-Mail wurde in den MVP-Ablauf eingespeist und als gelber Freigabe-Vorgang markiert.`,
      answer: "Guten Tag,\n\nvielen Dank für Ihre Nachricht. Five Fingers klassifiziert eingehende E-Mails, lädt passenden Kontext aus Kundendaten und Wissensbasis und bereitet daraus einen Antwortentwurf vor.\n\nGern schlage ich Ihnen einen kurzen Demo-Termin vor: Dienstag um 10:30 Uhr oder Donnerstag um 14:00 Uhr?\n\nHinweis: Diese E-Mail wurde mit Unterstützung von KI erstellt.\n\nFreundliche Grüße\nFive Fingers Demo-Team",
      reason: "Test-Mail erkannt. Absicht: Demo-/Informationsanfrage. Status Gelb, weil externe Antworten im MVP vor Versand freigegeben werden."
    },
    crm: { firma: from, kontakt: from, seit: "heute", umsatz: "Lead", timeline: [{ t: nowTime(), e: "Test-Mail eingespeist (→ Gelb)" }] }
  });
  renderBoard(); renderCustomers();
  return id;
}

/* ═══════════════════ LIVE-DEMO ═══════════════════ */

function runLiveDemo() {
  if (state.demoRunning) return;
  state.demoRunning = true;
  let demoLeadId = null;
  const btn = $("#btnLiveDemo"); btn.classList.add("running"); btn.textContent = "● Demo läuft …";
  const seq = [
    [0, () => { showView("dashboard"); toast("▶ Live-Demo", "1 von 5 · E-Mail: ein normaler Dienstagvormittag – schauen Sie zu.", "info"); }],
    [1600, () => { toast("📥 Neue E-Mail", "Von: buero@steinberg-immobilien.de – „Besichtigungstermin Musterstraße 12?“", "info"); }],
    [3200, () => { demoLeadId = injectTestMail("Steinberg Immobilien", "Besichtigungstermin Musterstraße 12", "Guten Tag, wir hätten Interesse an einer Besichtigung der Musterstraße 12. Geht bei Ihnen Donnerstag?"); selectMail(demoLeadId, "dashboard"); toast("🧠 KI-Analyse", "Intent: Terminwunsch · CRM geladen · 84 % → Gelb (erscheint oben)", "warn"); audit("Live-Demo: Steinberg Immobilien klassifiziert (Gelb, 84 %)"); }],
    [6400, () => { toast("📞 Live-Demo", "2 von 5 · Telefon: Anruf nach Feierabend wird angenommen & transkribiert.", "info"); audit("Live-Demo: Anruf angenommen & transkribiert"); }],
    [8400, () => { selectMail("m8", "phone"); }],
    [10800, () => { showView("dashboard"); selectMail("m6", "dashboard"); toast("🟢 Live-Demo", "3 von 5 · Automatik: Standardfrage der Fahrschule – die KI darf senden.", "success"); }],
    [12800, () => { approveMail("m6"); }],
    [15000, () => { showView("social"); renderSocialPlan("handwerk", $("#socialProduct").value.trim()); toast("📣 Live-Demo", "4 von 5 · Social: fertige Posts für 5 Kanäle & Zielgruppen aus CRM & Produktdaten.", "info"); }],
    [17600, () => { showView("customers"); if (demoLeadId) playJourney(demoLeadId); toast("🧭 Live-Demo", "5 von 5 · Kundenreise: derselbe Kunde – von der Anfrage bis zufrieden.", "info"); }],
    [22400, () => { showView("dashboard"); toast("✓ Live-Demo beendet", "E-Mail · Telefon · Automatik · Social · Kundenreise – ein Kontext, volle Kontrolle. Jetzt selbst klicken!", "success"); state.demoRunning = false; btn.classList.remove("running"); btn.textContent = "▶ Live-Demo"; }]
  ];
  seq.forEach(([d, fn]) => setTimeout(fn, d));
}

/* ═══════════════════ TOUR ═══════════════════ */

let tourIndex = 0;
function showTourStep() {
  const step = tourSteps[tourIndex];
  $("#tourStepLabel").textContent = `Schritt ${tourIndex + 1} von ${tourSteps.length}`;
  $("#tourTitle").textContent = step.title; $("#tourText").textContent = step.text;
  $("#tourNext").textContent = tourIndex === tourSteps.length - 1 ? "Fertig ✓" : "Weiter →";
  showView(step.view);
}
function startTour() { tourIndex = 0; $("#tourOverlay").hidden = false; showTourStep(); }
function endTour() { $("#tourOverlay").hidden = true; showView("dashboard"); }

/* ═══════════════════ ACCORDION ═══════════════════ */

function wireAccordions() {
  $$(".acc-head").forEach((head) => {
    const key = head.dataset.acc;
    const body = document.querySelector(`[data-acc-body="${key}"]`);
    if (body && body.classList.contains("open")) head.classList.add("open");
    head.addEventListener("click", () => {
      const open = body.classList.toggle("open");
      head.classList.toggle("open", open);
    });
  });
}

/* Upload-Simulation */
function wireUpload(inputId, listId) {
  const input = $("#" + inputId), list = $("#" + listId);
  input.addEventListener("change", () => {
    [...input.files].forEach((f) => {
      const ic = /\.pdf$/i.test(f.name) ? "📄" : /\.(xls|xlsx|csv)$/i.test(f.name) ? "📊" : /\.(doc|docx)$/i.test(f.name) ? "📝" : "📎";
      const row = document.createElement("div");
      row.className = "upload-file";
      row.innerHTML = `<span class="uf-ic">${ic}</span><span>${esc(f.name)}</span><button class="uf-x" title="Entfernen">✕</button>`;
      row.querySelector(".uf-x").addEventListener("click", () => row.remove());
      list.appendChild(row);
    });
    input.value = "";
  });
}

/* ═══════════════════ INIT & EVENTS ═══════════════════ */

$$("[data-view-target]").forEach((btn) => btn.addEventListener("click", () => showView(btn.dataset.viewTarget)));

$("#btnMenu").addEventListener("click", () => $("#app").classList.toggle("nav-collapsed"));

$("#btnApprove").addEventListener("click", () => approveMail(state.selected));
$("#btnEdit").addEventListener("click", startEdit);
$("#btnSaveEdit").addEventListener("click", saveEdit);
$("#btnCancelEdit").addEventListener("click", cancelEdit);
$("#btnSnooze").addEventListener("click", () => snoozeMail(state.selected));
$("#btnManual").addEventListener("click", () => manualMail(state.selected));
$("#btnLocate").addEventListener("click", locateInBoard);
$("#btnCallback").addEventListener("click", callback);

$$("#toneSwitch .tone-btn").forEach((btn) => btn.addEventListener("click", () => {
  state.tone = btn.dataset.tone;
  $$("#toneSwitch .tone-btn").forEach(b => b.classList.toggle("active", b === btn));
  const mail = mails.find(m => m.id === state.selected);
  if (state.editing) $("#answerTextarea").value = currentAnswer(mail);
  else typewrite($("#answerText"), currentAnswer(mail), 3);
}));

$$("[data-process]").forEach((btn) => btn.addEventListener("click", () => openProcess(btn.dataset.process)));

$("#modalClose").addEventListener("click", closeModal);
$("#modalOverlay").addEventListener("click", (e) => { if (e.target === $("#modalOverlay")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); } });

$("#btnLiveDemo").addEventListener("click", runLiveDemo);
$("#btnTour").addEventListener("click", startTour);
$("#tourNext").addEventListener("click", () => { if (tourIndex >= tourSteps.length - 1) endTour(); else { tourIndex += 1; showTourStep(); } });
$("#tourSkip").addEventListener("click", endTour);

function simulateEmail() {
  const samples = [
    ["Steinberg Immobilien", "Besichtigungstermin Musterstraße 12", "Guten Tag, wir hätten Interesse an einer Besichtigung. Geht bei Ihnen Donnerstag?"],
    ["Café Rosenthal", "Anfrage Catering Firmenfeier", "Hallo, wir planen eine Feier für 40 Personen. Können Sie ein Angebot machen?"],
    ["Bauer & Söhne GmbH", "Wartungsvertrag verlängern", "Sehr geehrte Damen und Herren, wir möchten unseren Wartungsvertrag verlängern. Bitte um Rückmeldung."]
  ];
  const s = samples[Math.floor(Math.random() * samples.length)];
  const id = injectTestMail(s[0], s[1], s[2]);
  selectMail(id, "dashboard");
  toast("✉ Anfrage simuliert", `Neue E-Mail von ${s[0]} – erscheint oben in Gelb, Entwurf liegt rechts bereit.`, "warn");
  audit(`Anfrage simuliert: ${s[0]} (→ Gelb)`);
}
$("#btnSimTop").addEventListener("click", simulateEmail);

$("#btnSimulateCall").addEventListener("click", () => {
  const id = "call-" + Date.now();
  mails.push({
    id, ts: Date.now(), status: "yellow", tag: "Telefon", tagClass: "yellow", time: nowTime(),
    subject: "Rückrufwunsch – Angebotsfrage", sender: "Petra Lindner", channel: "Telefon",
    preview: "Anruferin drückt 1. Sie möchte ein Angebot für 3 Standorte besprechen.", confidence: 86, cal: null, tokens: 1290, phone: true,
    sysactions: ["Rückrufwunsch erkannt (Option 1)", "Kalender: heute 15:30 Uhr vorgeschlagen", "CRM: Neukontakt „Petra Lindner“ angelegt", "Thema: Mehrstandort-Angebot"],
    attachments: [{ kind: "crm", name: "CRM-Notiz: Petra Lindner", meta: "Neukontakt aus Anruf" }],
    detail: {
      title: "Telefon: Petra Lindner",
      text: "Simulierter Anruf bei besetzter Leitung. Die Anruferin hat 1 gedrückt und möchte einen Rückruf zum Thema Mehrstandort-Angebot.",
      answer: "Transkript:\n„Guten Tag, Lindner hier von der Lindner Gebäudeservice GmbH. Wir haben drei Standorte und würden gern über ein Angebot sprechen. Bitte um Rückruf am Nachmittag.“\n\nSystemaktion:\n– Rückrufwunsch erkannt (Nachmittag)\n– CRM: Neukontakt angelegt\n– Kalendervorschlag: heute 15:30 Uhr",
      reason: "Quelle: Telefon-Assistent (Simulation). Absicht: Rückruf + Angebotsanfrage. Status Gelb – Angebotsthemen werden vom Menschen freigegeben."
    },
    crm: { firma: "Lindner Gebäudeservice GmbH", kontakt: "Petra Lindner", seit: "heute", umsatz: "Lead (3 Standorte)", timeline: [{ t: nowTime(), e: "Anruf simuliert, transkribiert (→ Gelb)" }, { t: nowTime(), e: "Kalender + CRM automatisch befüllt" }] }
  });
  renderBoard(); renderCustomers();
  selectMail(id);
  toast("📞 Anruf angenommen & simuliert", "Transkript erstellt, Rückruf erkannt, Kalender + CRM befüllt – Vorgang oben in Gelb.", "info");
  audit("Anruf von Petra Lindner angenommen & transkribiert");
});

/* Social: analyze / mic / plan / refocus */
const analysisResults = {
  crm: ["3 Dokumente ausgewertet · 1.240 Kontakte", "4 Zielsegmente erkannt (u. a. Eigenheim 45+, Hausverwaltung)", "Top-Kanäle: Instagram & Facebook regional"],
  psy: ["Trigger erkannt: Sicherheit, Dringlichkeit, sozialer Beweis", "Ton je Zielgruppe: seriös (B2B) bis locker (Gen Z)", "Empfehlung: Nutzen zuerst, dann klarer Call-to-Action"]
};
$$("[data-analyze]").forEach((btn) => btn.addEventListener("click", () => {
  const key = btn.dataset.analyze, out = $("#" + key + "Out");
  out.innerHTML = `<div class="analysis-row">⏳ Dokumente werden analysiert …</div>`;
  setTimeout(() => {
    out.innerHTML = analysisResults[key].map(r => `<div class="analysis-row"><span>✓</span>${esc(r)}</div>`).join("");
    toast("✓ Analyse fertig", key === "crm" ? "CRM-Segmente & Kanäle erkannt." : "Psychologische Trigger abgeleitet.", "success");
    audit((key === "crm" ? "CRM-Analyse" : "Verhaltenspsychologie-Analyse") + " abgeschlossen");
  }, 1200);
}));
$$("[data-mic]").forEach((btn) => btn.addEventListener("click", () => {
  if (btn.classList.contains("recording")) return;
  btn.classList.add("recording"); const label = btn.textContent; btn.textContent = "● Aufnahme …";
  setTimeout(() => {
    btn.classList.remove("recording"); btn.textContent = label;
    const key = btn.dataset.mic, out = $("#" + key + "Out");
    const row = document.createElement("div"); row.className = "analysis-row";
    row.innerHTML = `<span>🎤</span>Transkribiert: „Bitte die neue Winter-Aktion für Bestandskunden mit einplanen.“`;
    out.appendChild(row);
    toast("🎤 Aufnahme transkribiert", "Ihr Zuruf wurde erfasst und der Analyse hinzugefügt.", "info");
  }, 1600);
}));

$("#createSocialPlan").addEventListener("click", () => {
  const branche = $("#socialCustomer").value, product = $("#socialProduct").value.trim();
  $("#socialIntro").textContent = "Die KI analysiert CRM-Segmente, Zielgruppen und Produktdaten …";
  $("#socialFeed").innerHTML = `<div class="social-post"><div class="social-post-body"><p>⏳ Zielgruppen abgeglichen, Produktdaten geladen, Content pro Kanal erzeugt …</p></div></div>`;
  setTimeout(() => {
    renderSocialPlan(branche, product);
    toast("✨ Content-Strategie erstellt", "Fertige Posts für 5 Kanäle & Zielgruppen – Veröffentlichung erst nach Freigabe.", "success");
    audit(`Social-Strategie für „${socialStrategies[branche].headline}“${product ? " · Thema: " + product : ""} erzeugt`);
  }, 1300);
});

$("#btnRefocus").addEventListener("click", () => {
  const aud = $("#refocusInput").value.trim();
  if (!aud) { toast("Zielgruppe fehlt", "Bitte eine Zielgruppe eingeben.", "warn"); return; }
  const branche = $("#socialCustomer").value, product = $("#socialProduct").value.trim() || socialStrategies[branche].headline;
  $("#socialIntro").textContent = `Neuanalyse für Zielgruppe „${aud}“ – Ansprache, Kanal und Tonalität werden neu bestimmt …`;
  $("#socialFeed").innerHTML = `<div class="social-post"><div class="social-post-body"><p>⏳ Persona „${esc(aud)}“ wird analysiert, Ansprache & Kanäle werden neu gewählt …</p></div></div>`;
  setTimeout(() => {
    const posts = [
      { pf: "instagram", aud, text: `Speziell für ${aud}: „${product}“ – kurz, visuell, mit klarem Vorteil. Story-Reihe + Reel, Call-to-Action „Jetzt sichern“.`, tags: "#Zielgruppe #Kampagne #Aktion" },
      { pf: "linkedin", aud, text: `Fachlicher Aufhänger zu „${product}“ für ${aud}: Nutzen mit Zahlen belegt, seriöser Ton, Terminlink am Ende.`, tags: "#B2B #Fachbeitrag #Vertrauen" },
      { pf: "newsletter", aud, text: `Persönliche Mail an ${aud}: Problem – Lösung – Angebot „${product}“. Betreffzeile A/B-getestet.`, tags: "Betreff: passend zu „" + product + "“" }
    ];
    $("#socialHeadline").textContent = "Strategie – Zielgruppe: " + aud;
    $("#socialFeed").innerHTML = posts.map((p, i) => socialPostHtml(p, i, i * 70)).join("");
    wireSocialFoot();
    toast("🎯 Neue Zielgruppe bearbeitet", `Der ganze Prozess lief für „${aud}“ – 3 passende Entwürfe liegen bereit.`, "success");
    audit(`Zielgruppen-Refokus: „${aud}“ – Content neu erzeugt`);
  }, 1500);
});

$("#testMailForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const from = $("#testFrom").value.trim() || "testkunde@example.de";
  const subject = $("#testSubject").value.trim() || "Test-Mail";
  const body = $("#testBody").value.trim() || "Bitte um Rückmeldung.";
  toast("📥 Test-Mail empfangen", "Die Pipeline verarbeitet die Mail – Schritt für Schritt.", "info");
  runPipeline(() => {
    const id = injectTestMail(from, subject, body);
    selectMail(id, "dashboard");
    toast("🟡 Klassifiziert: Gelb", "Vorgang erscheint oben im Dashboard, Entwurf liegt rechts bereit (84 %).", "warn");
    audit(`Test-Mail von ${from} eingespeist & klassifiziert (Gelb)`);
  });
});

wireUpload("crmUpload", "crmUploadList");
wireUpload("psyUpload", "psyUploadList");

/* Seed-Audit */
["System gestartet – alle 5 Assistenten verbunden (Gmail, Kalender, Telefonie)",
 "Regelwerk geladen: 12 Automatik-Regeln, 4 Sperr-Regeln",
 "Vorgang Agentur West automatisch abgeschlossen (Regel #7)"].forEach(audit);

/* Erst-Render */
wireAccordions(); renderArch(); renderPricing();
renderBoard(); renderCalendar(); renderCalendarList(); renderOutbox(); renderCustomers();
renderTokens(); renderSocialPlan("handwerk", $("#socialProduct").value.trim());
renderDetail(false); animateCounters();
