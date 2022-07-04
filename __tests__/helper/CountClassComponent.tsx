import React from 'react'
import { RootModel } from './store'

interface CounterProps {
  state: RootModel['counter']['state']
  reducers: RootModel['counter']['reducers']
  effects: RootModel['counter']['effects']
}

export class Counter extends React.Component<CounterProps> {
  render() {
    const { state, reducers, effects } = this.props

    return (
      <div>
        <div data-testid="count">{state.count}</div>
        <div data-testid="increase" onClick={reducers.increase} />
        <div data-testid="decrease" onClick={reducers.decrease} />
        <div data-testid="increaseAsync" onClick={effects.increaseAsync} />
      </div>
    )
  }
}
