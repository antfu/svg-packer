import * as Buffer from 'node:buffer'
import * as fsp from 'node:fs/promises'

packWasm()

async function packWasm() {
  const file = await fsp.readFile('./node_modules/ttf2woff2/jssrc/ttf2woff2.wasm')
  await fsp.writeFile('./src/ttf2woff2.wasm.js', `export const wasmUrl = 'data:application/wasm;base64,${Buffer.Buffer.from(file).toString('base64')}';`, 'utf8')
}
