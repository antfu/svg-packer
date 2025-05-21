import { isCI } from 'std-env'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  /* plugins: [nodePolyfills({
    include: [
      'buffer',
      'fs',
      'path',
      'stream',
      'string_decoder',
    ],
    protocolImports: true,
  })], */
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
      {
        test: {
          setupFiles: './dist/index.iife.js',
          include: [
            'test/*.browser.ts',
          ],
          name: 'browser',
          browser: {
            enabled: true,
            headless: isCI,
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
})
