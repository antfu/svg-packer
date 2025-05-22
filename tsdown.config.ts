import * as fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import stdLibBrowser from 'node-stdlib-browser'
import plugin from 'node-stdlib-browser/helpers/esbuild/plugin'
import { defineConfig } from 'tsdown/config'

const root = fileURLToPath(new URL('.', import.meta.url))

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
        entryPoints: [path.resolve(root, './dist/index.mjs')],
        outfile: path.resolve(root, './dist/index.browser.js'),
        bundle: true,
        format: 'iife',
        // beware of the globalName, it won't work since it will be exposed as SvgPacker.SvgPacker instead of SvgPacker
        globalName: 'SvgPacker',
        inject: [path.resolve('node_modules/node-stdlib-browser/helpers/esbuild/shim')],
        define: {
          global: 'global',
          process: 'process',
          Buffer: 'Buffer',
        },
        plugins: [plugin(stdLibBrowser)],
      })
      // will require the user to use SvgPacker.SvgPacker({...}) instead SvgPacker({...})
      // this code will patch the export to use SvgPacker.SvgPacker
      await editFile(path.resolve(root, './dist/index.browser.js'), (content) => {
        return content.replace(
          'return __toCommonJS(index_exports);',
          'return __toCommonJS(index_exports).SvgPacker;',
        )
      })
    },
  },
})

async function editFile(filePath: string, edit: (content: string) => string) {
  const content = await fsp.readFile(filePath, 'utf8')
  await fsp.writeFile(filePath, edit(content), 'utf8')
}
