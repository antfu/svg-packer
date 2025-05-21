import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [nodePolyfills({
    include: [
      'buffer',
      'fs',
      'path',
      'stream',
      'string_decoder',
    ],
    protocolImports: true,
  })],
})
