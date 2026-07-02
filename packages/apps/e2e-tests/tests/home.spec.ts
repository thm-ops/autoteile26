import { test, expect } from '@playwright/test';

test.describe('Homepage - Produktliste', () => {

  test('sollte Homepage laden', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Header prüfen
    await expect(page.locator('header')).toBeVisible();
  });

  test('sollte Produkte in Grid anzeigen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Mindestens ein Produkt sollte sichtbar sein
    const productCards = page.locator('div[class*="max-w-sm"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('sollte Produktkarten mit Informationen anzeigen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Erste Produktkarte prüfen
    const firstCard = page.locator('div[class*="max-w-sm"]').first();

    // Produktname (bold text)
    const productName = firstCard.locator('p.font-bold.text-xl');
    await expect(productName).toBeVisible();

    // Beschreibung (text-foreground)
    const description = firstCard.locator('p.text-foreground.text-base');
    await expect(description).toBeVisible();

    // Preis
    const price = firstCard.locator('p.font-bold.text-lg');
    await expect(price).toBeVisible();

    // "Details ansehen" Button
    await expect(firstCard.locator('a:has-text("Details ansehen")')).toBeVisible();

    // "In den Warenkorb" Button mit Icon
    await expect(firstCard.locator('button:has-text("In den Warenkorb")')).toBeVisible();
  });

  test('sollte zum Produktdetail navigieren', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Klick auf "Details ansehen"
    const detailsLink = page.locator('a:has-text("Details ansehen")').first();
    await detailsLink.click();

    // URL sollte zu Produktdetail führen
    await expect(page).toHaveURL(/\/products\/[^/]+/);
  });

  test('sollte Navigation zu Startseite haben', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Mindestens ein Produkt sollte sichtbar sein
    const productCount = await page.locator('div[class*="max-w-sm"]').count();
    expect(productCount).toBeGreaterThan(0);
  });
});