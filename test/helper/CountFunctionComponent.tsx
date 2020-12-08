import React from 'react'
import store from './store'

export const Counter: React.FC = () => {
  const { state, reducers, effects } = store.useModel('counter')

  return (
    <div>
      <div data-testid="count">{state.count}</div>
      <div data-testid="increase" onClick={reducers.increase} />
      <div data-testid="decrease" onClick={reducers.decrease} />
      <div data-testid="increaseAsync" onClick={effects.increaseAsync} />
    </div>
  )
}
