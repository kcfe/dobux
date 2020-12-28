import { act } from '@testing-library/react-hooks'
import { createModel } from '../src'
import { Store } from '../src/core/Store'
import { createHook } from './helper/createHook'
import { defaultStoreOptions } from './helper/shared'

const store = new Store(
  {
    test: createModel()({
      state: {
        count: 1,
      },
    }),
  },
  defaultStoreOptions
)

describe('Store test', () => {
  it('Store should be defined', () => {
    expect(Store).toBeDefined()
    expect(Store.prototype.constructor).toBe(Store)
  })

  it('should have valid api', () => {
    const methods = Object.keys(store)

    expect(methods).toContain('Provider')
    expect(methods).toContain('withProvider')
    expect(methods).toContain('useModel')
    expect(methods).toContain('withModel')
    expect(methods).toContain('getState')
  })

  it('state can be primitive value', () => {
    const { Provider, useModel } = new Store(
      {
        counter: {
          state: 1,
          reducers: {
            increase() {
              return 2
            },
          },
          effects: () => ({}),
        },
      },
      defaultStoreOptions
    )

    const { result } = createHook(Provider, useModel, 'counter')

    expect(result.current.state).toBe(1)

    act(() => {
      result.current.reducers.increase()
    })

    expect(result.current.state).toBe(2)
  })

  it('state can be array', () => {
    const { Provider, useModel } = new Store(
      {
        counter: {
          state: [1, 2, 3],
          reducers: {
            increase() {
              return 2
            },
          },
          effects: () => ({}),
        },
      },
      defaultStoreOptions
    )

    const { result } = createHook(Provider, useModel, 'counter')

    expect(result.current.state).toEqual([1, 2, 3])
  })

  it('state can be object', () => {
    const { Provider, useModel } = new Store(
      {
        counter: {
          state: {
            count: 1,
          },
          reducers: {
            increase(state) {
              state.count += 1
            },
          },
          effects: () => ({}),
        },
      },
      defaultStoreOptions
    )

    const { result } = createHook(Provider, useModel, 'counter')

    expect(result.current.state.count).toBe(1)

    act(() => {
      result.current.reducers.increase()
    })

    expect(result.current.state.count).toBe(2)
  })
})
