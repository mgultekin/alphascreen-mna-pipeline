import { defineConfig } from 'vitest/config';

// Standalone Vitest config so the test runner does NOT load vite.config.ts, which
// pulls in the @tailwindcss/vite plugin and its platform-specific native binary
// (@tailwindcss/oxide-*). The unit tests are pure Node and need none of the app's
// build tooling — loading it broke CI, because the Windows-generated lockfile does
// not install the Linux tailwind-oxide binary on the runner.
export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    environment: 'node',
  },
});
