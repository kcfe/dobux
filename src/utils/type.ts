import { Noop } from '../types'

/* istanbul ignore next */
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

/**
 * 是否是 Undefined
 * @param target
 */
export function isUndefined(target: any): target is undefined {
  return isTypeof(target, 'undefined')
}

/**
 * 是否是 Null
 * @param target
 */
export function isNull(target: any): target is null {
  return isTypeof(target, 'null')
}

/**
 * 是否是 String
 * @param target
 */
export function isString(target: any): target is string {
  return isTypeof(target, 'string')
}

/**
 * 是否是普通函数
 * @param target
 */
export function isFunction(target: any): target is Noop {
  return isTypeof(target, 'function')
}

/**
 * 是否是 Async 函数
 * @param target
 */
export function isAsyncFunc(target: unknown): target is AsyncGeneratorFunction {
  return typeof target === 'function' && target.constructor.name === 'AsyncFunction'
}

/**
 * 是否是 Object
 * @param target
 */
export function isObject(target: any): target is Record<string, unknown> {
  return isTypeof(target, 'object')
}

/**
 * 是否是数组
 * @param target
 */
export function isArray(target: any): target is Array<any> {
  return isTypeof(target, 'array')
}

/**
 * 是否是 Promise
 * @param target
 */
export function isPromise(target: any): target is Promise<any> {
  return target && typeof target.then === 'function'
}
