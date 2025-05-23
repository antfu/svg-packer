import type { SvgPackerResult } from '../../src'
import { page } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { appendIconsToTheDomBody, expectedFontName, options, replaceCssFontUrls } from '../../test/shared'

import '../src/main'

it('svg-packer in Vite', async () => {
  await expect.poll(() => 'SvgPacker' in window).toBeTruthy()

  const download = page.getByRole('link', { hasText: 'Download' })

  await expect.element(download).toBeTruthy()
  await expect.element(download).toHaveTextContent('Download maf.zip')
  await expect.element(download).toHaveAttribute(
    'href',
    expect.stringContaining('blob:http:'),
  )
  const href = download.element().getAttribute('href')
  const data = await fetch(href).then(r => r.blob())
  expect(data.size).toBeGreaterThan(0)
  await expect.poll(() => 'SvgPackerResult' in window).toBeTruthy()
  if ('SvgPackerResult' in window) {
    const result = window.SvgPackerResult as SvgPackerResult
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
    let cssContent = await css.blob.text()
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
    cssContent = replaceCssFontUrls(cssContent, result)
    const style = globalThis.document.createElement('style')
    style.textContent = `${cssContent}    
i {
  padding: 5px;
  color: #717171;
  display: inline-block;
  font-size: 1.2em;
}
`
    globalThis.document.head.append(style)
    await new Promise(resolve => setTimeout(resolve, 100))
    const iconDeclarations = await appendIconsToTheDomBody()
    const fontName = expectedFontName(options)
    for (const { css } of iconDeclarations) {
      expect(css).toBeTruthy()
      expect(css.content).toBeTruthy()
      expect(css.fontFamily).toBe(fontName)
      expect(css.fontStyle).toBe('normal')
    }
  }
})
