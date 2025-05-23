import { resolve } from 'node:path'
import { isCI } from 'std-env'
import { SvgPackerVitePlugin } from 'svg-packer/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        resolve(__dirname, '..'),
      ],
    },
  },
  plugins: [SvgPackerVitePlugin()],
  test: {
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
