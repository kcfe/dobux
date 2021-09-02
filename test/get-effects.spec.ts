import { act } from '@testing-library/react-hooks'
import { createStore } from '../src/index'
import { counter } from './helper/model'
import { createHook } from './helper/createHook'

describe('getEffects test', () => {
  it('call getEffects with no parameter should return all model effects', async () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const effects = store.getEffects()

    expect(effects).toHaveProperty('counter')

    await act(async () => {
      await effects.counter.increaseAsync()
    })

    expect(result.current.state.count).toBe(1)

    await act(async () => {
      await effects.counter.decreaseAsync()
    })
    expect(result.current.state.count).toBe(0)
  })

  it('call getEffects with parameter should return specific model state', async () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const effects = store.getEffects('counter')

    expect(typeof effects.increaseAsync === 'function').toBeTruthy()
    expect(typeof effects.decreaseAsync === 'function').toBeTruthy()

    await act(async () => {
      await effects.increaseAsync()
    })
    expect(result.current.state.count).toBe(1)

    await act(async () => {
      await effects.decreaseAsync()
    })
    expect(result.current.state.count).toBe(0)
  })

  it('call getEffects with not exist parameter should throw error', () => {
    const store = createStore({
      counter,
    })

    // @ts-ignore
    expect(() => store.getEffects('counter1')).toThrow(
      'Invariant Failed: [store.getEffects] Expected the modelName to be one of counter, but got counter1'
    )
  })
})
