# Linting & Code Formatting Guide

This project uses **ESLint** with **Prettier** to enforce consistent code style and detect dead code (unused imports, variables, and exports).

## Configuration Files

- **`.eslintrc.cjs`** — ESLint configuration with TypeScript, Prettier, and unused code detection
- **`.prettierrc`** — Prettier formatting rules
- **`.eslintignore`** — Files/folders to exclude from linting

## Local Development

### Run Linting

Check for style violations and unused code:

```bash
npm run lint
```

### Auto-Fix Issues
Automatically fix all fixable linting and formatting issues:
```bash
npm run lint:fix
```

### Format Code
Format all files according to Prettier rules:
```bash
npm run format
```

### CI/CD Integration
Linting runs automatically in GitHub Actions (.github/workflows/ci.yml) to ensure code quality before merging pull requests.

1. Lint job — Enforces Prettier + unused code rules
2.   Fails the build if violations found
3.   Reports errors in PR/commit