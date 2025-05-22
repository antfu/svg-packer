import type { PluginOption } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export function SvgPackerVitePlugin(): PluginOption {
  return [{
    name: 'vite-svg-packer-optimize-deps-plugin',
    config() {
      return {
        optimizeDeps: {
          include: [
            'sax',
            'svg-pathdata',
            'transformation-matrix',
            'yerror',
            'debug',
            'stream',
            'vite-plugin-node-polyfills/shims/buffer',
            'vite-plugin-node-polyfills/shims/global',
            'vite-plugin-node-polyfills/shims/process',
            'node:fs',
            'node:path',
            'node:stream',
            'node:string_decoder',
            'client-zip',
            'svg2ttf',
            'ttf2eot',
            'ttf2woff',
            'ttf2woff2/jssrc/index.js',
          ],
        },
      }
    },
  }, nodePolyfills({
    include: [
      'buffer',
      'fs',
      'path',
      'stream',
      'string_decoder',
    ],
    protocolImports: true,
  })]
}
