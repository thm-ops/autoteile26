# E2E Tests (Playwright) 🎭

Automated End-to-End tests for the autoteile26 web shop.

## Test Coverage

- **Homepage & Product List**: Product visibility, navigation, grid layout, and product card information.
- **Shopping Cart (Drawer & Page)**: Adding/removing items, quantity controls, price calculation, and PayPal checkout button.
- **Product Details**: Product information display, add-to-cart functionality, and back-to-overview navigation.

## Prerequisites

### 1. Install Playwright Browsers (One-time setup)

```bash
cd packages/apps/e2e-tests
npm install
npx playwright install --with-deps
```
**Important: The application must be running on http://localhost:3001 before tests start.**

## Running Tests
All commands should be run from the E2E directory or use workspace scripts from the project root:
From E2E Directory
```bash
cd packages/apps/e2e-tests

# Run all tests (headless)
npm run test

# Run tests in UI mode (interactive dashboard)
npm run test:ui

# Debug mode (step-by-step with Playwright Inspector)
npm run test:debug

# Run tests with visible browser
npm run test:headed

# Display the last HTML test report
npm run test:report
```

##From Project Root (Workspace Scripts)
```bash
# Run E2E tests via workspace
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Headed mode (visible browser)
npm run test:e2e:headed
```
## Troubleshooting
### Tests Fail with "Connection Refused" or "ECONNREFUSED"
* Cause: Application not running on http://localhost:3000
* **Solution:**
1. Verify services are running: docker compose -f docker-compose.dev.yml ps
2. Start Web App: npm run dev:web
3. Start Service: npm run start:dev:service
4. Check via browser: http://localhost:3001

**Empty UI Dashboard or Playwright Spawn Errors (Windows/PowerShell)**

On Windows, especially in VS Code or IntelliJ terminals, Playwright may fail to launch browsers.

**Solution 1:** Use native Windows Command Prompt (CMD) instead of PowerShell

**Solution 2:** Run these commands in PowerShell to fix missing system paths:
```powershell
$env:SystemRoot = "C:\Windows"
$env:ComSpec = "C:\Windows\system32\cmd.exe"
$env:Path += ";C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem"
```
**Locator Timeouts ("toBeVisible" fails)**

* Check if selectors match the actual DOM (use npm run test:e2e:ui or --debug mode)
* Increase timeout in playwright.config.ts if needed
* View failure screenshots in playwright-report/ after test run

**Tests Pass Locally but Fail in CI**

* Ensure .github/workflows/e2e-tests.yml starts services before tests
* Verify environment variables (.env) are set in GitHub Actions secrets
* Check Docker image builds successfully: docker compose -f docker-compose.dev.yml up -d --build

## CI/CD Integration

Tests run automatically on push to main/develop and on pull requests via GitHub Actions (.github/workflows/e2e-tests.yml). Reports are uploaded as artifacts.



