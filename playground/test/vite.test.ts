import { page } from '@vitest/browser/context'
import { expect, it } from 'vitest'

import '../src/main'

it('svg-packer in Node', async () => {
  await expect.poll(() => 'SvgPacker' in window).toBeTruthy()

  const download = page.getByRole('link', { hasText: 'Download' })

  await expect.element(download).toBeTruthy()
  await expect.element(download).toHaveTextContent('Download maf.zip')
  await expect.element(download).toHaveAttribute(
    'href',
    expect.stringContaining('blob:http:'),
  )
})
