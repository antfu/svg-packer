import type { SvgPackerResult } from '../src'
import { describe, expect, it } from 'vitest'

describe('SvgPacker in the browser', () => {
  it('SvgPacker is present', async () => {
    expect('SvgPacker' in globalThis).toBeTruthy()
    const result: SvgPackerResult = await globalThis.SvgPacker({
      icons: [{
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" />
</svg>`,
        name: 'icon1',
      }],
    })
    expect(result.files).toBeTruthy()
    expect(Array.from(Object.values(result.files)).map(m => m.name)).toMatchInlineSnapshot(`
      [
        "iconfont.svg",
        "iconfont.ttf",
        "iconfont.eot",
        "iconfont.woff",
        "iconfont.woff2",
        "iconfont.css",
        "_demo.html",
      ]
    `)
    const css = result.files.css
    expect(css).toBeTruthy()
    expect(css.blob).toBeTruthy()
    expect(css.blob.size).toBeGreaterThan(0)
    let cssContent = await css.blob.text()
    expect(cssContent).toMatchInlineSnapshot(`
      "
      @font-face {
        font-family: "iconfont";
        src: url("./iconfont.eot");
        src: url("./iconfont.eot") format("embedded-opentype"),
             url("./iconfont.ttf") format("truetype"),
             url("./iconfont.woff") format("woff"),
             url("./iconfont.woff2") format("woff2"),
             url("./iconfont.svg") format("svg");
        font-weight: normal;
        font-style: normal;
      }

      .iconfont {
        font-family: "iconfont" !important;
        font-size: 1em;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }


      .iconfont.icon1:before {
      content: "\\e001";
      }

      "
    `)
    cssContent = cssContent
      .replace(/"\.\/iconfont\.eot"/g, result.files.eot.url)
      .replace('"./iconfont.ttf"', result.files.ttf.url)
      .replace('"./iconfont.woff"', result.files.woff.url)
      .replace('"./iconfont.woff2"', result.files.woff2.url)
      .replace('"./iconfont.svg"', result.files.svg.url)
    const style = globalThis.document.createElement('style')
    style.textContent = `${cssContent}    
i {
  padding: 5px;
  color: #717171;
  display: inline-block;
}
`
    globalThis.document.head.append(style)
    await new Promise(resolve => setTimeout(resolve, 100))
    const icon = globalThis.document.createElement('i')
    icon.className = `i iconfont icon1`
    icon.setAttribute('data-test-id', 'icon1')
    globalThis.document.body.append(icon)
    await new Promise(resolve => setTimeout(resolve, 100))
    const before = globalThis.getComputedStyle(icon, ':before')
    expect(before).toBeTruthy()
    expect(before.content).toBeTruthy()
    expect(before.fontFamily).toBe('iconfont')
    expect(before.fontStyle).toBe('normal')
  })
})
