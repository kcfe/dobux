import { act } from '@testing-library/react-hooks'
import { createStore } from '../src/index'
import { counter } from './helper/model'
import { createHook } from './helper/createHook'

describe('getState test', () => {
  it('call getState with no parameter should return all model state', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const increase = result.current.reducers.increase
    const decrease = result.current.reducers.decrease

    expect(store.getState()).toEqual({
      counter: {
        count: 0,
        data: {},
      },
    })

    act(() => {
      increase()
    })
    expect(result.current.state.count).toBe(1)

    expect(store.getState()).toEqual({
      counter: {
        count: 1,
        data: {},
      },
    })

    act(() => {
      decrease()
    })
    expect(store.getState()).toEqual({
      counter: {
        count: 0,
        data: {},
      },
    })
  })

  it('call getState with parameter should return specific model state', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const increase = result.current.reducers.increase
    const decrease = result.current.reducers.decrease

    expect(store.getState('counter')).toEqual({
      count: 0,
      data: {},
    })

    act(() => {
      increase()
    })
    expect(result.current.state.count).toBe(1)

    expect(store.getState('counter')).toEqual({
      count: 1,
      data: {},
    })

    act(() => {
      decrease()
    })
    expect(store.getState('counter')).toEqual({
      count: 0,
      data: {},
    })
  })

  it('call getState with not exist parameter should throw error', () => {
    const store = createStore({
      counter,
    })

    // @ts-ignore
    expect(() => store.getState('counter1')).toThrow(
      'Invariant Failed: [store.getState] Expected the modelName to be one of counter, but got counter1'
    )
  })
})
