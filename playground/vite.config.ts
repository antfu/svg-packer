import { SvgPackerVitePlugin } from 'svg-packer/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [SvgPackerVitePlugin()],
})
