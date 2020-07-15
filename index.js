const StringDecoder = require('string_decoder').StringDecoder
const Stream = require('stream').PassThrough
const SVGIcons2SVGFontStream = require('svgicons2svgfont')
const svg2ttf = require('svg2ttf')
const ttf2eot = require('ttf2eot')
const ttf2woff = require('ttf2woff')
const ttf2woff2 = require('ttf2woff2')
const JSZip = require('jszip')

/* Public methods */
async function SvgPacker({ icons, ...options }) {
  const zip = new JSZip()

  options.fontName = options.fontName || 'iconfont'
  options.cssPrefix = options.cssPrefix || 'iconfont'
  options.fileName = options.fileName || options.fontName
  options.startCodepoint = options.startCodepoint || 0xE001
  options.normalize = true
  options.fontHeight = options.fontHeight || 150
  options.descent = options.options || 0
  options.fixedWidth = options || false

  const parsedIcons = icons.map(({ svg, name, unicode }, i) => {
    return {
      svg,
      name,
      unicode: unicode || (options.startCodepoint + i),
    }
  })

  const iconStreams = parsedIcons.map(({ svg, unicode, name }) => {
    const iconStream = new Stream()
    iconStream.write(svg, 'utf8')
    iconStream.end()
    iconStream.metadata = {
      unicode: [String.fromCharCode(unicode)],
      name,
    }
    return iconStream
  })

  const result = {
    files: {},
  }

  const addFile = (filename, ext, data, mime = 'text/plain') => {
    zip.file(filename, data)
    const blob = new Blob([data], { type: mime })
    result.files[ext] = {
      name: filename,
      blob,
      url: makeUrl(blob),
    }
  }

  // Generate SVG
  const content = await makeSVG(iconStreams, options)
  const ttfFontBuffer = makeTTF(content)
  addFile(`${options.fileName}.svg`, 'svg', content, 'image/svg+xml')
  addFile(`${options.fileName}.ttf`, 'ttf', ttfFontBuffer, 'application/octet-stream')
  addFile(`${options.fileName}.eot`, 'eot', makeEOT(ttfFontBuffer), 'application/octet-stream')
  addFile(`${options.fileName}.woff`, 'woff', makeWOFF(ttfFontBuffer), 'application/octet-stream')
  addFile(`${options.fileName}.woff2`, 'woff2', makeWOFF2(ttfFontBuffer), 'application/octet-stream')
  addFile(`${options.fileName}.css`, 'css', makeCSS(parsedIcons, options), 'text/css')
  addFile('_demo.html', 'demoHTML', makeDemoHTML(parsedIcons, options), 'text/html')

  result.zip = {}
  result.zip.blob = zip.generate({ type: 'blob', compression: 'DEFLATE' })
  result.zip.url = makeUrl(result.zip.blob)
  result.zip.name = `${options.fileName}.zip`
  return result
}

function makeUrl(blob) {
  if (typeof window === 'undefined' || !window.URL || !window.URL.createObjectURL)
    return null
  return window.URL.createObjectURL(blob)
}

function makeSVG(iconStreams, options) {
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

function makeTTF(svgFont) {
  const ttfFontBuffer = svg2ttf(svgFont).buffer

  return ttfFontBuffer
}

function makeEOT(ttfFontBuffer) {
  const eotFontBuffer = ttf2eot(ttfFontBuffer).buffer

  return eotFontBuffer
}

function makeWOFF(ttfFontBuffer) {
  const woffFontBuffer = ttf2woff(new Uint8Array(ttfFontBuffer.buffer)).buffer
  return woffFontBuffer
}

function makeWOFF2(ttfFontBuffer) {
  ttfFontBuffer = new Uint8Array(ttfFontBuffer)
  let buf = Buffer.alloc(ttfFontBuffer.length)
  for (let i = 0, j = ttfFontBuffer.length; i < j; i++)
    buf.writeUInt8(ttfFontBuffer[i], i)

  buf = ttf2woff2(buf)
  const woff2FontBuffer = new Uint8Array(buf.length)
  for (let i = 0, j = buf.length; i < j; i++)
    woff2FontBuffer[i] = buf.readUInt8(i)

  return woff2FontBuffer
}

function makeCSS(icons, { fontName, fileName, cssPrefix }) {
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

function makeDemoHTML(icons, { fontName, fileName, cssPrefix }) {
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

module.exports = SvgPacker

if (typeof window !== 'undefined')
  window.SvgPacker = SvgPacker
