import { options } from '../../test/shared.ts'

import('svg-packer').then(async ({ SvgPacker }) => {
  const result = await SvgPacker(options)

  const a = document.createElement('a')
  a.href = result.zip.url!
  a.download = result.zip.name
  a.textContent = `Download ${result.zip.name}`
  document.body.append(a)

  // eslint-disable-next-line no-console
  console.log(result)
  if (import.meta.env.MODE === 'test') {
    // @ts-expect-error I'm lazy to augment this
    window.SvgPackerResult = result
  }
})
