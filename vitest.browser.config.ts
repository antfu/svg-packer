import { isCI } from 'std-env'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: './dist/index.browser.js',
    include: [
      'test/*.browser.ts',
    ],
    name: 'browser',
    browser: {
      enabled: true,
      headless: isCI,
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
})
