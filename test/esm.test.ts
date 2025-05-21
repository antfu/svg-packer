import { expect, it } from 'vitest'
import { SvgPacker } from '../src'

it('svg-packer in Node', async () => {
  const result = await SvgPacker({
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
  const cssContent = await css.blob.text()
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
})
