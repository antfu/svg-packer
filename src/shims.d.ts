// not included in the pack
import type { SvgPacker } from './index'

declare module 'node:stream' {
  interface PassThrough {
    metadata?: {
      unicode: string[]
      name: string
    }
  }
}

declare global {
  interface Window {
    SvgPacker: SvgPacker
  }
}
