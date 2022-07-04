import { act } from '@testing-library/react-hooks'
import { createStore } from '../src/index'
import { counter } from './helper/model'
import { createHook } from './helper/createHook'

describe('multiple stores test', () => {
  it('should multiple stores to be isolated', () => {
    const { Provider: Provider1, useModel: useModel1 } = createStore({
      counter,
    })
    const { Provider: Provider2, useModel: useModel2 } = createStore({
      counter,
    })

    const { result: result1 } = createHook(Provider1, useModel1, 'counter')
    const { result: result2 } = createHook(Provider2, useModel2, 'counter')

    expect(result1.current.state.count).toBe(0)
    expect(result2.current.state.count).toBe(0)
  })

  it('should be able to exec specific stores', () => {
    const { Provider: Provider1, useModel: useModel1 } = createStore({
      counter,
    })
    const { Provider: Provider2, useModel: useModel2 } = createStore({
      counter,
    })

    const { result: result1 } = createHook(Provider1, useModel1, 'counter')
    const { result: result2 } = createHook(Provider2, useModel2, 'counter')

    act(() => {
      result1.current.reducers.increase()
      result2.current.reducers.decrease()
    })

    expect(result1.current.state.count).toBe(1)
    expect(result2.current.state.count).toBe(-1)
  })

  it('should share state when use same model', async () => {
    const { Provider, useModel } = createStore({
      counter,
    })

    const { result: result1, waitForNextUpdate } = createHook(Provider, useModel, 'counter')
    const { result: result2 } = createHook(Provider, useModel, 'counter')

    expect(result1.current.state.count).toBe(0)
    expect(result2.current.state.count).toBe(0)

    act(() => {
      result1.current.reducers.increase()
    })

    expect(result1.current.state.count).toBe(1)
    expect(result2.current.state.count).toBe(1)

    act(() => {
      result2.current.reducers.decrease()
    })

    expect(result1.current.state.count).toBe(0)
    expect(result2.current.state.count).toBe(0)

    expect(result1.current.effects.increaseAsync.loading).toBeFalsy()
    expect(result2.current.effects.increaseAsync.loading).toBeFalsy()

    act(() => {
      result1.current.effects.increaseAsync()
    })
    expect(result1.current.effects.increaseAsync.loading).toBeTruthy()
    expect(result2.current.effects.increaseAsync.loading).toBeTruthy()

    await waitForNextUpdate()

    expect(result1.current.effects.increaseAsync.loading).toBeFalsy()
    expect(result2.current.effects.increaseAsync.loading).toBeFalsy()
  })
})
