import { act } from '@testing-library/react-hooks'
import { createStore } from '../src/index'
import { counter } from './helper/model'
import { createHook } from './helper/createHook'

describe('getReducers test', () => {
  it('call getReducers with no parameter should return all model reducers', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const reducers = store.getReducers()

    expect(reducers).toHaveProperty('counter')

    act(() => {
      reducers.counter.increase()
    })
    expect(result.current.state.count).toBe(1)

    act(() => {
      reducers.counter.decrease()
    })
    expect(result.current.state.count).toBe(0)
  })

  it('call getReducers with parameter should return specific model state', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const reducers = store.getReducers('counter')

    expect(typeof reducers.increase === 'function').toBeTruthy()
    expect(typeof reducers.decrease === 'function').toBeTruthy()
    expect(typeof reducers.setValue === 'function').toBeTruthy()
    expect(typeof reducers.setValues === 'function').toBeTruthy()
    expect(typeof reducers.reset === 'function').toBeTruthy()

    act(() => {
      reducers.increase()
    })
    expect(result.current.state.count).toBe(1)

    act(() => {
      reducers.decrease()
    })
    expect(result.current.state.count).toBe(0)
  })

  it('call getReducers with not exist parameter should throw error', () => {
    const store = createStore({
      counter,
    })

    // @ts-ignore
    expect(() => store.getReducers('counter1')).toThrow(
      'Invariant Failed: [store.getReducers] Expected the modelName to be one of counter, but got counter1'
    )
  })
})
