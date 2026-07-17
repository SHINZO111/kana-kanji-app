import { defineConfig, devices } from '@playwright/test'

// E2E config. Port 4310 is deliberate (NOT the default 4173/5174) so these
// tests never collide with other local preview servers running in parallel.
const PORT = 4310

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
    // Block SW registration during tests: otherwise every fresh context
    // precaches all ~4,400 PWA assets (~8.4MB), slowing tests and keeping
    // `networkidle` from ever settling. The SW build itself is covered
    // separately by the static checks in tests/e2e/sw-precache.spec.ts.
    serviceWorkers: 'block',
  },
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
