import { describe, expect, it } from 'vitest'
import { SvgPacker } from '../src'

describe('cli', () => {
  it('node works', async () => {
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
  })
})
