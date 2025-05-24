import { isCI } from 'std-env'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: [
      {
        test: {
          include: [
            'test/*.test.ts',
          ],
          name: 'node',
          environment: 'node',
        },
      },
      // this test is about testing the iife with the preview provider
      // won't run in the CI, and the test will be skipped
      {
        test: {
          setupFiles: './dist/index.browser.js',
          include: [
            'test/*.browser.ts',
          ],
          name: 'browser',
          browser: {
            enabled: !isCI,
            provider: 'preview',
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
})
