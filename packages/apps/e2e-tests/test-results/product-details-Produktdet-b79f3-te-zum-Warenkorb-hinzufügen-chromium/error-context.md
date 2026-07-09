# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-details.spec.ts >> Produktdetails-Seite >> sollte zum Warenkorb hinzufügen
- Location: tests\product-details.spec.ts:41:6

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text("In den Warenkorb"), button:has-text("Zum Warenkorb")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button:has-text("In den Warenkorb"), button:has-text("Zum Warenkorb")')

```

```yaml
- banner:
    - link "MeinShop":
        - /url: /
    - link "Startseite":
        - /url: /
    - button "Warenkorb"
- main:
    - main:
        - link "Zurück zur Übersicht":
            - /url: /
        - img "Sommerreifen Premium"
        - heading "Sommerreifen Premium" [level=1]
        - paragraph: Hochwertige Sommerreifen mit optimaler Bodenhaftung und Bremsverhalten.
        - paragraph: 89,99 €
        - paragraph: PayPal ClientID fehlt.
- alert
- heading "Warenkorb (0 Artikel)" [level=2]
- button "Close cart"
- paragraph: Dein Warenkorb ist leer
- paragraph: Derzeit hast du keine Artikel im Warenkorb. Besuche den Shop, um Artikel hinzuzufügen.
- button "Zurück zum Shop"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Produktdetails-Seite', () => {
  4  |
  5  |   test('sollte Produktdetails laden', async ({ page }) => {
  6  |     // Zur Produktdetails-Seite navigieren (erste Produkt-ID)
  7  |     await page.goto('/products/1');
  8  |
  9  |     // "Zurück zur Übersicht" sollte sichtbar sein
  10 |     await expect(page.locator('text=Zurück zur Übersicht')).toBeVisible();
  11 |   });
  12 |
  13 |   test('sollte Produktbild und Name anzeigen', async ({ page }) => {
  14 |     await page.goto('/products/1');
  15 |
  16 |     // Produktbild
  17 |     await expect(page.locator('img').first()).toBeVisible();
  18 |
  19 |     // Produktname (Header)
  20 |     const heading = page.locator('h1, h2');
  21 |     await expect(heading.first()).toBeVisible();
  22 |   });
  23 |
  24 |   test('sollte Produktbeschreibung anzeigen', async ({ page }) => {
  25 |     await page.goto('/products/1');
  26 |
  27 |     // Prüft, ob die Überschrift da ist
  28 |     await expect(page.locator('text=Sommerreifen Premium')).toBeVisible();
  29 |
  30 |     // Prüft, ob der Beschreibungstext da ist
  31 |     await expect(page.locator('text=Hochwertige Sommerreifen mit optimaler Bodenhaftung')).toBeVisible();
  32 |   });
  33 |
  34 |   test('sollte Preis anzeigen', async ({ page }) => {
  35 |     await page.goto('/products/1');
  36 |
  37 |     // Preis-Text mit € sollte sichtbar sein
  38 |     await expect(page.locator('text=/€|EUR/')).toBeVisible();
  39 |   });
  40 |
  41 |  test('sollte zum Warenkorb hinzufügen', async ({ page }) => {
  42 |     await page.goto('/products/1');
  43 |
  44 |     // Button sollte existieren
  45 |     const addBtn = page.locator('button:has-text("In den Warenkorb"), button:has-text("Zum Warenkorb")');
> 46 |     await expect(addBtn).toBeVisible();
     |                          ^ Error: expect(locator).toBeVisible() failed
  47 |
  48 |     await addBtn.click();
  49 |
  50 |     // Cart-Counter sollte aktualisiert werden
  51 |     const cartBadge = page.locator('button[aria-label="Warenkorb"] span');
  52 |     await expect(cartBadge).toContainText('1');
  53 |   });
  54 |
  55 |   test('sollte zurück zur Übersicht navigieren', async ({ page }) => {
  56 |     await page.goto('/products/1');
  57 |
  58 |     // "Zurück zur Übersicht" klicken
  59 |     await page.locator('text=Zurück zur Übersicht').click();
  60 |
  61 |     // Zurück auf Homepage
  62 |     await expect(page).toHaveURL('/');
  63 |   });
  64 | });
```
