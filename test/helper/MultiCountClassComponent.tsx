import React from 'react'
import { RootModel } from './store'

interface CounterProps {
	[c: string]: RootModel
}

export class CounterWithContextName extends React.Component<CounterProps> {
  render() {
    const {
			forDobux: {
				counter,
				counter2
			}
		} = this.props

    return (
      <div>
        <div data-testid="count-1">{counter.state.count}</div>
        <div data-testid="increase-1" onClick={counter.reducers.increase} />
        <div data-testid="decrease-1" onClick={counter.reducers.decrease} />
        <div data-testid="increaseAsync-1" onClick={counter.effects.increaseAsync} />

				<div data-testid="count-2">{counter2.state.count}</div>
        <div data-testid="increase-2" onClick={counter2.reducers.increase} />
        <div data-testid="decrease-2" onClick={counter2.reducers.decrease} />
        <div data-testid="increaseAsync-2" onClick={counter2.effects.increaseAsync} />
      </div>
    )
  }
}

export class CounterWithDefault extends React.Component<CounterProps> {
  render() {
    const {
			dobuxModels: {
				counter,
				counter2
			}
		} = this.props

    return (
      <div>
        <div data-testid="count-1">{counter.state.count}</div>
        <div data-testid="increase-1" onClick={counter.reducers.increase} />
        <div data-testid="decrease-1" onClick={counter.reducers.decrease} />
        <div data-testid="increaseAsync-1" onClick={counter.effects.increaseAsync} />

				<div data-testid="count-2">{counter2.state.count}</div>
        <div data-testid="increase-2" onClick={counter2.reducers.increase} />
        <div data-testid="decrease-2" onClick={counter2.reducers.decrease} />
        <div data-testid="increaseAsync-2" onClick={counter2.effects.increaseAsync} />
      </div>
    )
  }
}