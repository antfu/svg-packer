import { expect, it } from 'vitest'
import { SvgPacker } from '../src'
import { options } from './shared'

it('svg-packer in Node', async () => {
  const result = await SvgPacker(options)
  expect(result.files).toBeTruthy()
  expect(Array.from(Object.values(result.files)).map(m => m.name)).toMatchInlineSnapshot(`
    [
      "maf.svg",
      "maf.ttf",
      "maf.eot",
      "maf.woff",
      "maf.woff2",
      "maf.css",
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
      font-family: "My Awesome Font";
      src: url("./maf.eot");
      src: url("./maf.eot") format("embedded-opentype"),
           url("./maf.ttf") format("truetype"),
           url("./maf.woff") format("woff"),
           url("./maf.woff2") format("woff2"),
           url("./maf.svg") format("svg");
      font-weight: normal;
      font-style: normal;
    }

    .i {
      font-family: "My Awesome Font" !important;
      font-size: 1em;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }


    .i.mdi\\:account-edit:before {
    content: "\\e001";
    }

    .i.mdi\\:account-tie:before {
    content: "\\e002";
    }

    "
  `)
})
