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
  optimizeDeps: {
    include: [
      'vite-plugin-node-polyfills/shims/buffer',
      'vite-plugin-node-polyfills/shims/global',
      'vite-plugin-node-polyfills/shims/process',
      'node:stream',
      'node:string_decoder',
    ],
  },
})
