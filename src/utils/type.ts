import { Noop } from '../types'

/* istanbul-ignore-next */
function isTypeof(target: any, type: string): boolean {
  if (!type) {
    return false
  }

  try {
    type = type.toLocaleLowerCase()

    if (target === undefined) {
      return type === 'undefined'
    }

    if (target === null) {
      return type === 'null'
    }

    return Object.prototype.toString.call(target).toLocaleLowerCase() === `[object ${type}]`
  } catch (err) {
    return false
  }
}

export function isUndefined(target: any): target is undefined {
  return isTypeof(target, 'undefined')
}

export function isNull(target: any): target is null {
  return isTypeof(target, 'null')
}

export function isString(target: any): target is string {
  return isTypeof(target, 'string')
}

export function isFunction(target: any): target is Noop {
  return isTypeof(target, 'function')
}

export function isObject(target: any): target is Record<string, unknown> {
  return isTypeof(target, 'object')
}

export function isModule(target: any): target is NodeModule {
  return isTypeof(target, 'module')
}

export function isArray(target: any): target is Array<any> {
  return isTypeof(target, 'array')
}

export function isPromise(target: any): target is Promise<any> {
  return target && typeof target.then === 'function'
}
