import type { BufferLike, InputWithSizeMeta } from 'client-zip'
import type { FileExtension } from './utils'
import * as buffer from 'node:buffer'
import * as process from 'node:process'
import { PassThrough } from 'node:stream'
import { StringDecoder } from 'node:string_decoder'
import { downloadZip } from 'client-zip'
import svg2ttf from 'svg2ttf'
import { SVGIcons2SVGFontStream } from 'svgicons2svgfont'
import ttf2eot from 'ttf2eot'
import ttf2woff from 'ttf2woff'

export type { FileExtension } from './utils'
export { FileExtensions } from './utils'

export interface SvgPackerOptions {
  /**
   * @default 'iconfont'
   */
  fontName?: string
  /**
   * @default 'iconfont'
   */
  cssPrefix?: string
  /**
   * @default 'iconfont'
   */
  fileName?: string
  /**
   * @default 'iconfont'
   */
  startCodepoint?: number
  /**
   * @default 1000
   */
  fontHeight?: number
  /**
   * @default 0
   */
  descent?: number
  /**
   * @default false
   */
  fixedWidth?: boolean
  icons: {
    svg: string
    name: string
    unicode?: number
  }[]
}

export interface SvgPackerResult {
  files: Record<FileExtension, {
    name: string
    blob: Blob
    url?: string
  }>
  zip: {
    name: string
    blob: Blob
    url?: string
  }
}

export async function SvgPacker({ icons, ...options }: SvgPackerOptions): Promise<SvgPackerResult> {
  const {
    fontName = 'iconfont',
    cssPrefix = 'iconfont',
    fileName = 'iconfont',
    startCodepoint = 0xE001,
    fontHeight = 1000,
    descent = 0,
    fixedWidth = false,
  } = options ?? {}

  const parsedIcons = icons.map(({ svg, name, unicode }, i) => {
    return {
      svg,
      name,
      unicode: unicode ?? (startCodepoint + i),
    }
  })

  const iconStreams = parsedIcons.map(({ svg, unicode, name }) => {
    const iconStream = new PassThrough()
    iconStream.write(svg, 'utf8')
    iconStream.end()
    iconStream.metadata = {
      unicode: [String.fromCharCode(unicode)],
      name,
    }
    return iconStream
  })

  const files = {} as SvgPackerResult['files']

  const zip = await downloadZip(generateZipEntries(
    iconStreams,
    {
      fontName,
      cssPrefix,
      fileName,
      startCodepoint,
      fontHeight,
      descent,
      fixedWidth,
      icons: parsedIcons,
    },
    files,
  )).blob()

  return {
    files,
    zip: {
      name: `${options.fileName}.zip`,
      blob: zip,
      url: makeUrl(zip),
    },
  }
}

function addFile(
  files: SvgPackerResult['files'],
  filename: string,
  ext: FileExtension,
  data: BufferLike,
  mime = 'text/plain',
) {
  const blob = new Blob([data], { type: mime })
  files[ext] = {
    name: filename,
    blob,
    url: makeUrl(blob),
  }
  return {
    name: filename,
    input: blob,
    url: makeUrl(blob),
  } satisfies InputWithSizeMeta & { url?: string }
}

function makeUrl(blob: Blob | MediaSource) {
  if (typeof window === 'undefined' || !window.URL || !window.URL.createObjectURL)
    return null
  return window.URL.createObjectURL(blob)
}

function makeSVG(iconStreams: PassThrough[], options: Omit<SvgPackerOptions, 'icons'>) {
  return new Promise((resolve) => {
    const fontStream = new SVGIcons2SVGFontStream(options)
    const parts = []
    const decoder = new StringDecoder('utf8')
    fontStream.on('data', (chunk) => {
      parts.push(decoder.write(chunk))
    })
    fontStream.on('finish', () => {
      resolve(parts.join(''))
    })
    iconStreams.forEach(fontStream.write.bind(fontStream))
    fontStream.end()
  })
}

function makeTTF(svgFont: BufferLike) {
  const ttfFontBuffer: Uint8Array = svg2ttf(svgFont).buffer

  return ttfFontBuffer
}

function makeEOT(ttfFontBuffer: Uint8Array) {
  const eotFontBuffer = ttf2eot(ttfFontBuffer).buffer

  return eotFontBuffer
}

function makeWOFF(ttfFontBuffer: Uint8Array) {
  const woffFontBuffer = ttf2woff(new Uint8Array(ttfFontBuffer.buffer)).buffer
  return woffFontBuffer
}

async function browserPromise() {
  const [{ wasmUrl }, { initWasmBrowser, ttf2woff2 }] = await Promise.all([
    import('./ttf2woff2.wasm'),
    import('./wasm'),
  ])

  await initWasmBrowser(wasmUrl)
  return ttf2woff2
}

async function preloadWasm() {
  const isNode: boolean
      = typeof process < 'u'
        && typeof process.stdout < 'u'
        && !process.versions?.deno
        && !globalThis.window

  return isNode
    ? await import('ttf2woff2/jssrc/index.js').then((m) => {
      return m.default || m
    }).catch((e) => {
      console.error('ERROR', e)
      Promise.reject(e)
    })
    : await browserPromise()
}

async function makeWOFF2(ttfFontBuffer: Uint8Array) {
  ttfFontBuffer = new Uint8Array(ttfFontBuffer)
  let buf = buffer.Buffer.alloc(ttfFontBuffer.length)
  for (let i = 0, j = ttfFontBuffer.length; i < j; i++)
    buf.writeUInt8(ttfFontBuffer[i], i)

  const ttf2woff2 = await preloadWasm()

  if (!ttf2woff2 || !(typeof ttf2woff2 === 'function'))
    throw new Error('ttf2woff2 not found')

  if (ttf2woff2 instanceof Error)
    throw ttf2woff2

  buf = ttf2woff2(buf) as buffer.Buffer<ArrayBuffer>
  const woff2FontBuffer = new Uint8Array(buf.length)
  for (let i = 0, j = buf.length; i < j; i++)
    woff2FontBuffer[i] = buf.readUInt8(i)

  return woff2FontBuffer
}

function makeCSS({ icons, fontName, fileName, cssPrefix }: SvgPackerOptions) {
  const css = `
@font-face {
  font-family: "${fontName}";
  src: url("./${fileName}.eot");
  src: url("./${fileName}.eot") format("embedded-opentype"),
       url("./${fileName}.ttf") format("truetype"),
       url("./${fileName}.woff") format("woff"),
       url("./${fileName}.woff2") format("woff2"),
       url("./${fileName}.svg") format("svg");
  font-weight: normal;
  font-style: normal;
}

.${cssPrefix} {
  font-family: "${fontName}" !important;
  font-size: 1em;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

${icons.map(({ name, unicode }) => `
.${cssPrefix}.${name.replace(/:/g, '\\:')}:before {
content: "\\${unicode.toString(16)}";
}
`).join('')}
`

  return css
}

function makeDemoHTML({ icons, fontName, fileName, cssPrefix }: SvgPackerOptions) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${fontName} Demo</title>
  <link rel="stylesheet" href="./${fileName}.css">
  <style>
html {
  font-size: 1.2em;
}
i {
  padding: 5px;
  color: #717171;
  display: inline-block;
}
  </style>
</head>
<body>
${icons.map(({ name }) => `<i class="${cssPrefix} ${name}"></i>`).join('')}
<!-- Generated by SVG Pack (https://github.com/antfu/svg-packer) -->
</body>
`
}

async function* generateZipEntries(
  iconStreams: PassThrough[],
  options: SvgPackerOptions,
  files: SvgPackerResult['files'],
): AsyncGenerator<{
    name: string
    input: Blob
    url?: string
  }> {
  const content = await makeSVG(iconStreams, options) as BufferLike
  yield addFile(files, `${options.fileName}.svg`, 'svg', content, 'image/svg+xml')
  const ttfFontBuffer = makeTTF(content)
  yield addFile(files, `${options.fileName}.ttf`, 'ttf', ttfFontBuffer, 'application/octet-stream')
  yield addFile(files, `${options.fileName}.eot`, 'eot', makeEOT(ttfFontBuffer), 'application/octet-stream')
  yield addFile(files, `${options.fileName}.woff`, 'woff', makeWOFF(ttfFontBuffer), 'application/octet-stream')
  yield addFile(files, `${options.fileName}.woff2`, 'woff2', await makeWOFF2(ttfFontBuffer), 'application/octet-stream')
  yield addFile(files, `${options.fileName}.css`, 'css', makeCSS(options), 'text/css')
  yield addFile(files, '_demo.html', 'demoHTML', makeDemoHTML(options), 'text/html')
}

if (typeof window !== 'undefined') {
  window.SvgPacker = SvgPacker
}
if (typeof self !== 'undefined') {
  self.SvgPacker = SvgPacker
}
if (typeof globalThis !== 'undefined') {
  globalThis.SvgPacker = SvgPacker
}
