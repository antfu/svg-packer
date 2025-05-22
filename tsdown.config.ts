import path from 'node:path'
import { build } from 'esbuild'
import stdLibBrowser from 'node-stdlib-browser'
import plugin from 'node-stdlib-browser/helpers/esbuild/plugin'
import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: 'src/index.ts',
  platform: 'node',
  format: 'esm',
  target: 'node16',
  dts: true,
  outExtensions() {
    return {
      js: '.mjs',
      dts: '.mts',
    }
  },
  hooks: {
    'build:done': async function () {
      await build({
        entryPoints: [path.resolve('dist/index.mjs')],
        outfile: path.resolve('dist/index.browser.js'),
        bundle: true,
        format: 'iife',
        // dont't add globalName, it won't work since it will be exposed as SvgPacker.SvgPacker instead of SvgPacker
        // globalName: 'SvgPacker',
        inject: [path.resolve('node_modules/node-stdlib-browser/helpers/esbuild/shim')],
        define: {
          global: 'global',
          process: 'process',
          Buffer: 'Buffer',
        },
        plugins: [plugin(stdLibBrowser)],
      })
    },
  },
})
