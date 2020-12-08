import { act } from '@testing-library/react-hooks'
import { createStore } from '../src/index'
import { counter } from './helper/model'
import { createHook } from './helper/createHook'

describe('reducer test', () => {
  it('customize reducers execution results should be as expected', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const increase = result.current.reducers.increase
    const decrease = result.current.reducers.decrease

    expect(increase.length).toBe(0)

    act(() => {
      increase()
    })
    expect(result.current.state.count).toBe(1)

    act(() => {
      decrease()
    })
    expect(result.current.state.count).toBe(0)
  })

  it('should not rerender when the value of mapStateToProps returned not modified', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter', state => {
      return {
        count: state.count,
      }
    })

    const increase = result.current.reducers.increase
    const decrease = result.current.reducers.decrease

    expect(result.current.state.count).toBe(0)
    expect(result.current.state.data).toBeUndefined()
    expect(increase.length).toBe(0)

    act(() => {
      increase()
    })
    expect(result.current.state.count).toBe(1)

    act(() => {
      decrease()
    })
    expect(result.current.state.count).toBe(0)

    act(() => {
      result.current.reducers.setValue('data', 1)
    })

    expect(result.current.state.data).toBeUndefined()
  })

  it('should provider build-in reducers when no customize passed', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const setValue = result.current.reducers.setValue
    const setValues = result.current.reducers.setValues
    const reset = result.current.reducers.reset

    expect(setValue.length).toBe(2)
    act(() => {
      setValue('count', 1)
    })
    expect(result.current.state.count).toBe(1)

    expect(setValues.length).toBe(1)
    act(() => {
      setValues({
        count: 10,
      })
    })
    expect(result.current.state.count).toBe(10)

    expect(reset.length).toBe(1)
    act(() => {
      reset('count')
    })
    expect(result.current.state.count).toBe(0)

    act(() => {
      setValues({
        data: 1,
        count: 10,
      })
    })

    expect(result.current.state.count).toBe(10)
    expect(result.current.state.data).toBe(1)

    act(() => {
      reset()
    })

    expect(result.current.state.count).toBe(0)
    expect(result.current.state.data).toEqual({})
  })

  it('should overwrite build-in reducers when customize passed', () => {
    const store = createStore({
      counter: {
        state: {
          count: 10,
        },
        reducers: {
          setValue(state, payload) {
            state.count = payload + 1
          },

          setValues(state, partialState) {
            Object.keys(partialState).forEach(key => {
              state[key] = partialState[key] + 1
            })
          },

          reset(state) {
            state.count = 10
          },
        },
        effects: () => ({}),
      },
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const setValue = result.current.reducers.setValue
    const setValues = result.current.reducers.setValues
    const reset = result.current.reducers.reset

    act(() => {
      setValue(1)
    })
    expect(result.current.state.count).toBe(2)

    act(() => {
      setValues({
        count: 10,
      })
    })
    expect(result.current.state.count).toBe(11)

    act(() => {
      reset()
    })
    expect(result.current.state.count).toBe(10)
  })
})
