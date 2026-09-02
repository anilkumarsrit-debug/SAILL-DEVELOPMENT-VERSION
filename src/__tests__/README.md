# SAILL Testing Architecture & Readiness Specification

This directory establishes the testing infrastructure for **SRIT AI Language Laboratory (SAILL R26)**.

## Test Structure

```
src/__tests__/
├── unit/          # Fast, isolated unit tests for utils, hooks, and helpers
├── integration/   # API route tests, IndexedDB storage tests, and Gemini AI failovers
└── e2e/           # Playwright/Cypress end-to-end browser user flows
```

## Running Tests

When automated test runners (e.g. Vitest / Jest / Playwright) are added to `package.json`:

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E test suite
npm run test:e2e
```

## Guidelines for Authors
- **Unit Tests**: Mock external AI calls and local storage.
- **Integration Tests**: Verify payload shapes against `docs/API_DOCUMENTATION.md`.
- **E2E Tests**: Test accessibility (a11y) roles and keyboard navigation.
