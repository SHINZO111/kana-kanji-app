import { defineConfig } from 'vitest/config'

// Unit + data-validation test runner (tests/data + tests/unit).
// E2E lives in tests/e2e and runs under Playwright (see playwright.config.ts).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/data/**/*.test.ts', 'tests/unit/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/register-sw.ts'],
      reporter: ['text', 'json-summary'],
    },
  },
})
