import { STORE_NAME_PREFIX } from '../src/common/const'
import { invariant } from '../src/utils/invariant'
import { shallowEqual } from '../src/utils/shallowEqual'
import * as type from '../src/utils/type'
import * as func from '../src/utils/func'

describe('util test', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should isDev return true when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development'
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('../src/common/env')

    expect(env.isDev).toBeTruthy()
    expect(env.isProd).toBeFalsy()
  })

  it('should isProd return true when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production'
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('../src/common/env')

    expect(env.isDev).toBeFalsy()
    expect(env.isProd).toBeTruthy()
  })

  it('should noop func return object', () => {
    expect(func.noop()).toEqual({})
  })

  it('should identify func return the same value with input', () => {
    const state = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(func.identify(state)).toEqual(state)
  })

  it('should return correct store name using getStoreName', () => {
    let count = 1
    expect(func.getStoreName()).toBe(`${STORE_NAME_PREFIX}/${count}`)
    count++
    expect(func.getStoreName()).toBe(`${STORE_NAME_PREFIX}/${count}`)
    count++
  })

  it('should not throw error when condition is true', () => {
    expect(() => invariant(true, 'this is error')).not.toThrow()
  })

  it('should throw error when condition is false', () => {
    expect(() => invariant(false, 'this is error')).toThrow('Invariant Failed: this is error')

    jest.isolateModules(() => {
      process.env.NODE_ENV = 'production'

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      expect(() => require('../src/utils/invariant').invariant(false, 'this is error')).toThrow(
        'Invariant Failed'
      )
    })
  })

  it('should return correct result using shallowEqual', () => {
    expect(shallowEqual(1, 2)).toBeFalsy()
    expect(shallowEqual(1, 1)).toBeTruthy()

    const o1 = {
      b: {
        c: 2,
      },
    }

    const o2 = {
      b: {
        c: 2,
      },
    }

    expect(shallowEqual(o1, o1)).toBeTruthy()
    expect(shallowEqual(o1, o2)).toBeFalsy()

    const o3 = {
      a: 1,
      b: 2,
    }

    expect(shallowEqual(o1, o3)).toBeFalsy()

    const o4 = {
      a: 1,
      b: 2,
    }

    expect(shallowEqual(o3, o4)).toBeTruthy()

    const o5 = {
      a: NaN,
    }

    expect(shallowEqual(o5, { a: NaN })).toBeTruthy()
    expect(shallowEqual(+0, -0)).toBeFalsy()
  })

  it('should judge correct type using type', () => {
    let a
    expect(type.isUndefined(a)).toBeTruthy()

    const b = null
    expect(type.isNull(b)).toBeTruthy()

    expect(type.isFunction(() => {})).toBeTruthy()
    expect(type.isString('dobux')).toBeTruthy()

    async function c() {}

    expect(type.isFunction(c)).toBeTruthy()
    expect(type.isPromise(c())).toBeTruthy()
    expect(type.isObject({})).toBeTruthy()
    expect(type.isArray([])).toBeTruthy()
  })
})
