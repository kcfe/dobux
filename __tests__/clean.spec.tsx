import { createStore } from '../src/index'
import { counter } from './helper/model'
import { createHook } from './helper/createHook'

console.error = jest.fn()

describe('clean test', () => {
  it('state should be reset when call clean function', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result, rerender } = createHook(Provider, useModel, 'counter')

    expect(result.current.state.count).toBe(0)

    const setValue = result.current.reducers.setValue

    setValue('count', 1)
    expect(result.current.state.count).toBe(1)

    const clean = result.current.clean

    expect(typeof clean).toBe('function')
    clean()
    rerender()
    expect(result.current.state.count).toBe(0)
  })
})
