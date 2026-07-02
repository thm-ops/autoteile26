import { test, expect } from '@playwright/test';

test.describe('Produktdetails-Seite', () => {

  test('sollte Produktdetails laden', async ({ page }) => {
    // Zur Produktdetails-Seite navigieren (erste Produkt-ID)
    await page.goto('/products/1');

    // "Zurück zur Übersicht" sollte sichtbar sein
    await expect(page.locator('text=Zurück zur Übersicht')).toBeVisible();
  });

  test('sollte Produktbild und Name anzeigen', async ({ page }) => {
    await page.goto('/products/1');

    // Produktbild
    await expect(page.locator('img').first()).toBeVisible();

    // Produktname (Header)
    const heading = page.locator('h1, h2');
    await expect(heading.first()).toBeVisible();
  });

  test('sollte Produktbeschreibung anzeigen', async ({ page }) => {
    await page.goto('/products/1');

    // Prüft, ob die Überschrift da ist
    await expect(page.locator('text=Sommerreifen Premium')).toBeVisible();

    // Prüft, ob der Beschreibungstext da ist
    await expect(page.locator('text=Hochwertige Sommerreifen mit optimaler Bodenhaftung')).toBeVisible();
  });

  test('sollte Preis anzeigen', async ({ page }) => {
    await page.goto('/products/1');

    // Preis-Text mit € sollte sichtbar sein
    await expect(page.locator('text=/€|EUR/')).toBeVisible();
  });

 test('sollte zum Warenkorb hinzufügen', async ({ page }) => {
    await page.goto('/products/1');

    // Button sollte existieren
    const addBtn = page.locator('button:has-text("In den Warenkorb"), button:has-text("Zum Warenkorb")');
    await expect(addBtn).toBeVisible();

    await addBtn.click();

    // Cart-Counter sollte aktualisiert werden
    const cartBadge = page.locator('button[aria-label="Warenkorb"] span');
    await expect(cartBadge).toContainText('1');
  });

  test('sollte zurück zur Übersicht navigieren', async ({ page }) => {
    await page.goto('/products/1');

    // "Zurück zur Übersicht" klicken
    await page.locator('text=Zurück zur Übersicht').click();

    // Zurück auf Homepage
    await expect(page).toHaveURL('/');
  });
});