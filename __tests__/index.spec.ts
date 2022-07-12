import { createStore, createModel } from '../src'
import { Store } from '../src/core/Store'
import { config, defaultStoreOptions } from './helper/shared'

describe('entry test', () => {
  it('createStore should be defined', () => {
    expect(createStore).toBeDefined()
  })

  it('should return the instance of Store when call createStore', () => {
    const store = createStore(
      {
        counter: config,
      },
      defaultStoreOptions
    )

    expect(store).toBeInstanceOf(Store)
  })

  it('should pass boolean to autoReset', () => {
    const store = createStore(
      {
        counter: config,
      },
      {
        autoReset: true,
      }
    )

    expect(store).toBeInstanceOf(Store)
  })

  it('should pass array to autoReset', () => {
    const store = createStore(
      {
        counter: config,
      },
      {
        autoReset: ['counter'],
      }
    )

    expect(store).toBeInstanceOf(Store)
  })

  it('should pass boolean to devtools', () => {
    const store = createStore(
      {
        counter: config,
      },
      {
        devtools: true,
      }
    )

    expect(store).toBeInstanceOf(Store)
  })

  it('should pass array to devtools', () => {
    const store = createStore(
      {
        counter: config,
      },
      {
        devtools: ['counter'],
      }
    )

    expect(store).toBeInstanceOf(Store)
  })

  it('createModel should be defined', () => {
    expect(createModel).toBeDefined()
  })

  it('should return the default value when config is invalid', () => {
    const store = createModel()({
      state: {
        count: 0,
      },
    })

    expect(store.state).toEqual({ count: 0 })
    expect(store.reducers).toEqual({})
    expect(typeof store.effects).toBe('function')
  })
})
