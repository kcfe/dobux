import { isProd } from '../common/env'

const prefix = 'Invariant Failed'

export function invariant(condition: any, message: string): never | undefined {
  if (condition) {
    return
  }

  if (isProd) {
    throw new Error(prefix)
  }

  throw new Error(`${prefix}: ${message}`)
}
