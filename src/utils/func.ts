import { STORE_NAME_PREFIX } from '../common/const'

export function noop(...args: any[]): any {
  return {}
}

export function identify(state: any): any {
  return state
}

let count = 0

export function getStoreName(): string {
  count++
  return `${STORE_NAME_PREFIX}/${count}`
}
