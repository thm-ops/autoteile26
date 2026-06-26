# Logging-Konzept für den Zahlungsprozess

## Ziel

Das Logging dient dazu, Fehler schnell zu erkennen und den Ablauf von Zahlungen nachvollziehen zu können, ohne sensible Daten zu speichern.

---

## Welche Ereignisse sollten geloggt werden?

- Benutzer meldet sich an
- Zahlung wird gestartet
- Zahlung erfolgreich abgeschlossen
- Zahlung fehlgeschlagen
- API-Fehler
- Datenbankfehler
- Serverfehler

---

## Welche Daten dürfen NICHT geloggt werden?

Folgende Informationen dürfen niemals in Log-Dateien gespeichert werden:

- Passwörter
- Kreditkartennummern
- CVV
- vollständige IBAN
- PayPal-Zugangsdaten
- Tokens
- Session-IDs

---

## Sinnvolle Log-Level

| Log-Level | Bedeutung |
|-----------|-----------|
| INFO | normale Abläufe |
| WARN | ungewöhnliche Ereignisse |
| ERROR | Fehler |
| DEBUG | nur während der Entwicklung |

---

## Sicherheitsmaßnahmen

- Zugriff auf Log-Dateien einschränken
- Logs regelmäßig archivieren
- Logs vor Manipulation schützen
- personenbezogene Daten anonymisieren

---

## Fazit

Ein gutes Logging hilft dabei, Fehler schneller zu finden und den Zahlungsprozess sicher zu überwachen, ohne vertrauliche Daten preiszugeben.