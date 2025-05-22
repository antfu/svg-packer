import type { SvgPackerOptions, SvgPackerResult } from '../src'

export const options = {
  fontName: 'My Awesome Font',
  fileName: 'maf',
  cssPrefix: 'i',
  icons: [
    {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M21.7 13.35l-1 1l-2.05-2.05l1-1a.55.55 0 0 1 .77 0l1.28 1.28c.21.21.21.56 0 .77M12 18.94l6.06-6.06l2.05 2.05L14.06 21H12v-2.06M12 14c-4.42 0-8 1.79-8 4v2h6v-1.89l4-4c-.66-.08-1.33-.11-2-.11m0-10a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4z" fill="currentColor"/></svg>',
      name: 'mdi:account-edit',
    },
    {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 3a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m4 10.54c0 1.06-.28 3.53-2.19 6.29L13 15l.94-1.88c-.62-.07-1.27-.12-1.94-.12c-.67 0-1.32.05-1.94.12L11 15l-.81 4.83C8.28 17.07 8 14.6 8 13.54c-2.39.7-4 1.96-4 3.46v4h16v-4c0-1.5-1.6-2.76-4-3.46z" fill="currentColor"/></svg>',
      name: 'mdi:account-tie',
    },
  ],
} satisfies SvgPackerOptions

const FontExtensions = ['eot', 'ttf', 'woff', 'woff2', 'svg'] as const
type FontExtension = typeof FontExtensions[number]

const fonts = FontExtensions.reduce((acc, ext) => {
  acc[ext] = new RegExp(`"./${options.fileName}.${ext}"`, 'g')
  return acc
}, {} as Record<FontExtension, RegExp>)

export function replaceCssFontUrls(css: string, result: SvgPackerResult): string {
  return css
    .replace(fonts.eot, result.files.eot.url)
    .replace(fonts.ttf, result.files.ttf.url)
    .replace(fonts.woff, result.files.woff.url)
    .replace(fonts.woff2, result.files.woff2.url)
    .replace(fonts.svg, result.files.svg.url)
}

export function expectedFontName({ fontName }: SvgPackerOptions) {
  return fontName ? (fontName[0] === '"' ? fontName : `"${fontName}"`) : undefined
}

export interface IconDeclaration {
  icon: string
  css: CSSStyleDeclaration
}

export async function appendIconsToTheDomBody(): Promise<IconDeclaration[]> {
  const { icons, cssPrefix } = options
  const iconsDeclarations: IconDeclaration[] = []
  for (const icon of icons) {
    const el = globalThis.document.createElement('i')
    el.className = `${cssPrefix} ${icon.name}`
    globalThis.document.body.append(el)
    await new Promise(resolve => setTimeout(resolve, 100))
    const before = globalThis.getComputedStyle(el, ':before')
    iconsDeclarations.push({
      icon: icon.name,
      css: before,
    })
  }

  return iconsDeclarations
}
