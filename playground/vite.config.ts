import { isCI } from 'std-env'
import { SvgPackerVitePlugin } from 'svg-packer/vite'
import { defineConfig } from 'vite'

export default defineConfig({
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
