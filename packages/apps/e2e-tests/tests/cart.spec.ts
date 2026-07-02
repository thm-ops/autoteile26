import { test, expect } from '@playwright/test';

test.describe('Warenkorb-Funktionalität', () => {

  test('sollte Warenkorb-Drawer öffnen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Produkt hinzufügen
    const addButton = page.locator('button:has-text("In den Warenkorb")').first();
    await addButton.click();
    await page.waitForTimeout(500);

    // Warenkorb-Button klicken
    const cartButton = page.locator('button').filter({ hasText: 'Warenkorb' }).first();
    await cartButton.click();

    await page.waitForTimeout(500);

    // Drawer: div.fixed.inset-y-0.right-0 mit translate-x-0
    // Warte bis Drawer SICHTBAR ist (nicht versteckt mit translate-x-full)
    const drawer = page.locator('div.fixed.inset-y-0.right-0.bg-white');
    await expect(drawer).toBeVisible();

    // Warenkorb-Header im Drawer prüfen
    const drawerHeader = drawer.locator('h2:has-text("Warenkorb")');
    await expect(drawerHeader).toBeVisible();
  });

  test('sollte zur Warenkorb-Seite navigieren', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Produkt hinzufügen
    const addButton = page.locator('button:has-text("In den Warenkorb")').first();
    await addButton.click();
    await page.waitForTimeout(300);

    // Zur Cart-Seite navigieren
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // Seite sollte Warenkorb-Überschrift anzeigen
    const heading = page.locator('h1:has-text("Warenkorb")');
    await expect(heading).toBeVisible();
  });

  test('sollte Artikel-Menge mit + Button erhöhen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button:has-text("In den Warenkorb")').first();
    await addButton.click();
    await page.waitForTimeout(300);

    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // Plus-Button klicken (aria-label="Increase quantity")
    const plusButton = page.locator('button[aria-label="Increase quantity"]').first();
    await expect(plusButton).toBeVisible();
    await plusButton.click();

    await page.waitForTimeout(300);

    // Heading sollte jetzt 2 Artikel anzeigen
    const heading = page.locator('h1');
    await expect(heading).toContainText('2 Artikel');
  });

  test('sollte Artikel-Menge mit - Button verringern', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 2 Produkte hinzufügen
    const addButtons = page.locator('button:has-text("In den Warenkorb")');
    await addButtons.first().click();
    await page.waitForTimeout(200);
    await addButtons.nth(1).click();
    await page.waitForTimeout(300);

    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // Heading sollte "2 Artikel" anzeigen
    const headingBefore = page.locator('h1');
    await expect(headingBefore).toContainText('2 Artikel');

    // Minus-Button klicken (aria-label="Decrease quantity")
    const minusButton = page.locator('button[aria-label="Decrease quantity"]').first();
    await minusButton.click();

    await page.waitForTimeout(300);

    // Heading sollte jetzt "1 Artikel" anzeigen
    const headingAfter = page.locator('h1');
    await expect(headingAfter).toContainText('1 Artikel');
  });

  test('sollte Artikel mit Trash-Icon entfernen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 2 Produkte hinzufügen
    const addButtons = page.locator('button:has-text("In den Warenkorb")');
    await addButtons.first().click();
    await page.waitForTimeout(200);
    await addButtons.nth(1).click();
    await page.waitForTimeout(300);

    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // Heading sollte "2 Artikel" anzeigen
    let heading = page.locator('h1');
    await expect(heading).toContainText('2 Artikel');

    // Trash-Button klicken (aria-label="Remove item")
    const trashButton = page.locator('button[aria-label="Remove item"]').first();
    await expect(trashButton).toBeVisible();
    await trashButton.click();

    await page.waitForTimeout(300);

    // Heading sollte jetzt "1 Artikel" anzeigen
    heading = page.locator('h1');
    await expect(heading).toContainText('1 Artikel');
  });

  test('sollte Gesamtsumme anzeigen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button:has-text("In den Warenkorb")').first();
    await addButton.click();
    await page.waitForTimeout(300);

    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // "Gesamtsumme" Label sollte sichtbar sein
    const totalLabel = page.locator('text=Gesamtsumme');
    await expect(totalLabel).toBeVisible();
  });

  test('sollte Checkout-Button mit PayPal Text zeigen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button:has-text("In den Warenkorb")').first();
    await addButton.click();
    await page.waitForTimeout(300);

    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // Button mit "Mit PayPal bezahlen" Text sollte sichtbar sein
    const checkoutBtn = page.locator('button:has-text("Mit PayPal bezahlen")');
    await expect(checkoutBtn).toBeVisible();
  });

  test('sollte vom leeren Warenkorb zurück zum Shop navigieren', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    const shopLink = page.locator('a:has-text("Zurück zum Shop")');
    await expect(shopLink).toBeVisible();

    await shopLink.click();

    // Sollte auf Homepage sein
    await expect(page).toHaveURL('/');
  });
});
