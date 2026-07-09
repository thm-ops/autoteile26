# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Warenkorb-Funktionalität >> sollte Checkout-Button mit PayPal Text zeigen
- Location: tests\cart.spec.ts:146:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text("Mit PayPal bezahlen")')
Expected: visible
Error: strict mode violation: locator('button:has-text("Mit PayPal bezahlen")') resolved to 2 elements:
    1) <button class="w-full bg-blue-600 text-white font-semibold py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex items-center justify-center gap-2">Mit PayPal bezahlen</button> aka getByRole('main').getByRole('button', { name: 'Mit PayPal bezahlen' })
    2) <button class="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3 flex items-center justify-center gap-2">Mit PayPal bezahlen</button> aka getByRole('button', { name: 'Mit PayPal bezahlen' }).nth(1)

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button:has-text("Mit PayPal bezahlen")')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - banner [ref=e2]:
        - generic [ref=e3]:
            - link "MeinShop" [ref=e4] [cursor=pointer]:
                - /url: /
            - generic [ref=e5]:
                - link "Startseite" [ref=e6] [cursor=pointer]:
                    - /url: /
                - button "Warenkorb" [ref=e7]:
                    - img [ref=e8]
                    - generic [ref=e12]: '1'
    - main [ref=e13]:
        - generic [ref=e14]:
            - heading "Warenkorb (1 Artikel)" [level=1] [ref=e15]
            - generic [ref=e16]:
                - generic [ref=e20]:
                    - img "Sommerreifen Premium" [ref=e22]
                    - generic [ref=e23]:
                        - heading "Sommerreifen Premium" [level=4] [ref=e24]
                        - paragraph [ref=e25]: 89,99 €
                        - generic [ref=e26]:
                            - generic [ref=e27]:
                                - button "Decrease quantity" [ref=e28]:
                                    - img [ref=e29]
                                - generic [ref=e30]: '1'
                                - button "Increase quantity" [ref=e31]:
                                    - img [ref=e32]
                            - button "Remove item" [ref=e33]:
                                - img [ref=e34]
                - generic [ref=e38]:
                    - heading "Zusammenfassung" [level=2] [ref=e39]
                    - generic [ref=e40]:
                        - generic [ref=e41]:
                            - generic [ref=e42]: Zwischensumme
                            - generic [ref=e43]: 89,99 €
                        - generic [ref=e44]:
                            - generic [ref=e45]: Versandkosten
                            - generic [ref=e46]: Kostenlos
                        - generic [ref=e47]:
                            - generic [ref=e48]: Gesamtsumme
                            - generic [ref=e49]: 89,99 €
                    - button "Mit PayPal bezahlen" [ref=e50]
                    - paragraph [ref=e51]:
                        - img [ref=e52]
                        - generic [ref=e55]: Sichere Zahlung. Die MwSt. ist im Preis enthalten.
    - alert [ref=e56]
    - generic [ref=e57]:
        - generic [ref=e58]:
            - heading "Warenkorb (1 Artikel)" [level=2] [ref=e59]:
                - img [ref=e60]
                - text: Warenkorb (1 Artikel)
            - button "Close cart" [ref=e63]:
                - img [ref=e64]
        - generic [ref=e69]:
            - img "Sommerreifen Premium" [ref=e71]
            - generic [ref=e72]:
                - heading "Sommerreifen Premium" [level=4] [ref=e73]
                - paragraph [ref=e74]: 89,99 €
                - generic [ref=e75]:
                    - generic [ref=e76]:
                        - button "Decrease quantity" [ref=e77]:
                            - img [ref=e78]
                        - generic [ref=e79]: '1'
                        - button "Increase quantity" [ref=e80]:
                            - img [ref=e81]
                    - button "Remove item" [ref=e82]:
                        - img [ref=e83]
        - generic [ref=e86]:
            - generic [ref=e87]:
                - generic [ref=e88]:
                    - generic [ref=e89]: Zwischensumme
                    - generic [ref=e90]: 89,99 €
                - generic [ref=e91]:
                    - generic [ref=e92]: Versandkosten
                    - generic [ref=e93]: Kostenlos
                - generic [ref=e94]:
                    - generic [ref=e95]: Gesamtsumme
                    - generic [ref=e96]: 89,99 €
            - button "Mit PayPal bezahlen" [ref=e97]
            - paragraph [ref=e98]:
                - img [ref=e99]
                - generic [ref=e102]: Sichere Zahlung. Die MwSt. ist im Preis enthalten.
            - link "Warenkorb-Seite ansehen" [ref=e103] [cursor=pointer]:
                - /url: /cart
```

# Test source

```ts
  59  |     // Plus-Button klicken (aria-label="Increase quantity")
  60  |     const plusButton = page.locator('button[aria-label="Increase quantity"]').first();
  61  |     await expect(plusButton).toBeVisible();
  62  |     await plusButton.click();
  63  |
  64  |     await page.waitForTimeout(300);
  65  |
  66  |     // Heading sollte jetzt 2 Artikel anzeigen
  67  |     const heading = page.locator('h1');
  68  |     await expect(heading).toContainText('2 Artikel');
  69  |   });
  70  |
  71  |   test('sollte Artikel-Menge mit - Button verringern', async ({ page }) => {
  72  |     await page.goto('/');
  73  |     await page.waitForLoadState('networkidle');
  74  |
  75  |     // 2 Produkte hinzufügen
  76  |     const addButtons = page.locator('button:has-text("In den Warenkorb")');
  77  |     await addButtons.first().click();
  78  |     await page.waitForTimeout(200);
  79  |     await addButtons.nth(1).click();
  80  |     await page.waitForTimeout(300);
  81  |
  82  |     await page.goto('/cart');
  83  |     await page.waitForLoadState('networkidle');
  84  |
  85  |     // Heading sollte "2 Artikel" anzeigen
  86  |     const headingBefore = page.locator('h1');
  87  |     await expect(headingBefore).toContainText('2 Artikel');
  88  |
  89  |     // Minus-Button klicken (aria-label="Decrease quantity")
  90  |     const minusButton = page.locator('button[aria-label="Decrease quantity"]').first();
  91  |     await minusButton.click();
  92  |
  93  |     await page.waitForTimeout(300);
  94  |
  95  |     // Heading sollte jetzt "1 Artikel" anzeigen
  96  |     const headingAfter = page.locator('h1');
  97  |     await expect(headingAfter).toContainText('1 Artikel');
  98  |   });
  99  |
  100 |   test('sollte Artikel mit Trash-Icon entfernen', async ({ page }) => {
  101 |     await page.goto('/');
  102 |     await page.waitForLoadState('networkidle');
  103 |
  104 |     // 2 Produkte hinzufügen
  105 |     const addButtons = page.locator('button:has-text("In den Warenkorb")');
  106 |     await addButtons.first().click();
  107 |     await page.waitForTimeout(200);
  108 |     await addButtons.nth(1).click();
  109 |     await page.waitForTimeout(300);
  110 |
  111 |     await page.goto('/cart');
  112 |     await page.waitForLoadState('networkidle');
  113 |
  114 |     // Heading sollte "2 Artikel" anzeigen
  115 |     let heading = page.locator('h1');
  116 |     await expect(heading).toContainText('2 Artikel');
  117 |
  118 |     // Trash-Button klicken (aria-label="Remove item")
  119 |     const trashButton = page.locator('button[aria-label="Remove item"]').first();
  120 |     await expect(trashButton).toBeVisible();
  121 |     await trashButton.click();
  122 |
  123 |     await page.waitForTimeout(300);
  124 |
  125 |     // Heading sollte jetzt "1 Artikel" anzeigen
  126 |     heading = page.locator('h1');
  127 |     await expect(heading).toContainText('1 Artikel');
  128 |   });
  129 |
  130 |   test('sollte Gesamtsumme anzeigen', async ({ page }) => {
  131 |     await page.goto('/');
  132 |     await page.waitForLoadState('networkidle');
  133 |
  134 |     const addButton = page.locator('button:has-text("In den Warenkorb")').first();
  135 |     await addButton.click();
  136 |     await page.waitForTimeout(300);
  137 |
  138 |     await page.goto('/cart');
  139 |     await page.waitForLoadState('networkidle');
  140 |
  141 |     // "Gesamtsumme" Label sollte sichtbar sein
  142 |     const totalLabel = page.locator('text=Gesamtsumme');
  143 |     await expect(totalLabel).toBeVisible();
  144 |   });
  145 |
  146 |   test('sollte Checkout-Button mit PayPal Text zeigen', async ({ page }) => {
  147 |     await page.goto('/');
  148 |     await page.waitForLoadState('networkidle');
  149 |
  150 |     const addButton = page.locator('button:has-text("In den Warenkorb")').first();
  151 |     await addButton.click();
  152 |     await page.waitForTimeout(300);
  153 |
  154 |     await page.goto('/cart');
  155 |     await page.waitForLoadState('networkidle');
  156 |
  157 |     // Button mit "Mit PayPal bezahlen" Text sollte sichtbar sein
  158 |     const checkoutBtn = page.locator('button:has-text("Mit PayPal bezahlen")');
> 159 |     await expect(checkoutBtn).toBeVisible();
      |                               ^ Error: expect(locator).toBeVisible() failed
  160 |   });
  161 |
  162 |   test('sollte vom leeren Warenkorb zurück zum Shop navigieren', async ({ page }) => {
  163 |     await page.goto('/cart');
  164 |     await page.waitForLoadState('networkidle');
  165 |
  166 |     const shopLink = page.locator('a:has-text("Zurück zum Shop")');
  167 |     await expect(shopLink).toBeVisible();
  168 |
  169 |     await shopLink.click();
  170 |
  171 |     // Sollte auf Homepage sein
  172 |     await expect(page).toHaveURL('/');
  173 |   });
  174 | });
  175 |
```
