import React from 'react'
import { createStore } from '../src/index'
import { counter } from './helper/model'
import { createHook } from './helper/createHook'
import { Counter, Counter1 } from './helper/CountFunctionComponent'
import { act, fireEvent, render } from '@testing-library/react'
import { store } from './helper/store'

console.error = jest.fn()

describe('effect test', () => {
  it('effect should be async function', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const increaseAsync = result.current.effects.increaseAsync

    expect(typeof increaseAsync().then).toBe('function')
  })

  it('effect should have expected field', () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result } = createHook(Provider, useModel, 'counter')

    const increaseAsync = result.current.effects.increaseAsync

    expect(increaseAsync.loading).toBe(false)
    expect(increaseAsync.identifier).toBe(0)
  })

  it('should set loading to true when the effect is executed, and after execution, it should be set to false', async () => {
    const store = createStore({
      counter,
    })
    const { Provider, useModel } = store

    const { result, waitForNextUpdate } = createHook(Provider, useModel, 'counter')

    const increaseAsync = result.current.effects.increaseAsync

    expect(increaseAsync.loading).toBe(false)
    increaseAsync()
    expect(increaseAsync.loading).toBe(true)

    await waitForNextUpdate()

    expect(increaseAsync.loading).toBe(false)
    expect(result.current.state.count).toBe(1)
  })

  it('should only rerender when Component depend effect loading', (done) => {
    const CounterRender = jest.fn()
    const Counter1Render = jest.fn()

    // https://spectrum.chat/testing-library/help/is-there-a-way-to-count-the-number-of-times-a-component-gets-rendered~8b8b3f8f-775d-49cc-80fd-baaf40fa37eb
    const { getByTestId, queryByText } =  render(
      <store.Provider>
        <Counter onRender={CounterRender} />
        <Counter1 onRender={Counter1Render} />
      </store.Provider>
    )
    
    expect(CounterRender).toBeCalledTimes(1)
    expect(Counter1Render).toBeCalledTimes(1)

    expect(queryByText('Loading ...')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(getByTestId('increaseAsync'))
    })

    expect(CounterRender).toBeCalledTimes(2)
    expect(Counter1Render).toBeCalledTimes(1)

    expect(queryByText('Loading ...')).toBeInTheDocument()

    setTimeout(() => {
      expect(CounterRender).toBeCalledTimes(4)
      expect(Counter1Render).toBeCalledTimes(2)
      done()
    }, 1000)
  })
})
