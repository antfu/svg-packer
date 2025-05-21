import * as path from 'node:path'
import { build } from 'esbuild'
import stdLibBrowser from 'node-stdlib-browser'
import plugin from 'node-stdlib-browser/helpers/esbuild/plugin'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  platform: 'node',
  clean: true,
  format: ['esm'],
  splitting: true,
  async onSuccess() {
    await build({
      entryPoints: [path.resolve('dist/index.js')],
      outfile: path.resolve('dist/index.iife.js'),
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
})
