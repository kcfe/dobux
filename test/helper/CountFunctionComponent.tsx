import React, { useImperativeHandle } from 'react'
import { store } from './store'

export interface CounterProps {
  onRender?: () => void
}

export const Counter: React.FC<CounterProps> = ({ onRender }) => {
  const { state, reducers, effects } = store.useModel('counter')

  if (onRender) {
    onRender()
  }

  if (effects.increaseAsync.loading) {
    return <div>Loading ...</div>
  }

  return (
    <div>
      <div data-testid="count">{state.count}</div>
      <div data-testid="increase" onClick={reducers.increase} />
      <div data-testid="decrease" onClick={reducers.decrease} />
      <div data-testid="increaseAsync" onClick={effects.increaseAsync} />
    </div>
  )
}

export const Counter1: React.FC<CounterProps> = ({ onRender }) => {
  const { state, reducers, effects } = store.useModel('counter')

  if (onRender) {
    onRender()
  }

  return (
    <div>
      <div data-testid="count1">{state.count}</div>
      <div data-testid="increase1" onClick={reducers.increase} />
      <div data-testid="decrease1" onClick={reducers.decrease} />
      <div data-testid="increaseAsync1" onClick={effects.increaseAsync} />
    </div>
  )
}

export const CounterWithRef = store.withProviderForwardRef<any>(
  React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => {
      return {
        methodFromUseImperativeHandle: () => true,
      }
    })

    return <></>
  })
)
