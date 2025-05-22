import type { PluginOption } from 'vite'
import * as fsp from 'node:fs/promises'
import * as module from 'node:module'
import * as path from 'node:path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export interface SvgPackerVitePluginOptions {
  disabled?: true
}

export function SvgPackerVitePlugin({ disabled }: SvgPackerVitePluginOptions = {}): PluginOption {
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
  }, disabled ? undefined : SvgPackerPlugin(), nodePolyfills({
    include: [
      'buffer',
      'fs',
      'path',
      'stream',
      'string_decoder',
    ],
    protocolImports: true,
  })].filter(Boolean) as PluginOption
}

function SvgPackerPlugin(): PluginOption {
  const svgPacker = 'svg-packer'
  const resolvedSvgPacker = `\0${svgPacker}`
  const virtualSvg = 'virtual:svgicons2svgfont'
  const resolvedSvg = `\0${virtualSvg}`
  const require = module.createRequire(import.meta.url)
  const svgPackerPath = require.resolve('svg-packer')
  const svgPath = require.resolve('svgicons2svgfont')
  const svgPackerPromise = fsp.readFile(svgPackerPath, 'utf8')
  const svgicons2svgfontPromise = fsp.readFile(svgPath, 'utf8')
  return {
    name: 'vite-svg-packer-plugin',
    enforce: 'pre',
    resolveId(id) {
      switch (true) {
        case id === svgPacker: return resolvedSvgPacker
        case id === virtualSvg: return resolvedSvg
        default: return undefined
      }
    },
    async load(id) {
      if (id === resolvedSvgPacker) {
        const code = await svgPackerPromise
        return code
          .replace(/from "svgicons2svgfont";/, `from "${virtualSvg}";`)
          .replace(/import\("\.\//g, `import("/@fs/${path.dirname(svgPackerPath).replace(/\\/g, '/')}/`)
      }
      if (id === resolvedSvg) {
        let code = await svgicons2svgfontPromise
        code = code
          .replace('export { fileSorter } from \'./filesorter.js\';', '')
          .replace('export * from \'./iconsdir.js\';', '')
          .replace('export * from \'./metadata.js\';', '')
          .replace(/from\s+'\.\//g, `from '/@fs/${path.dirname(svgPath).replace(/\\/g, '/')}/`)
        return code
      }
    },
  }
}
