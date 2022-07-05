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
			models: {
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

export class CounterWithSameContextName extends React.Component<{
  models: string,
  myModel: any
}> {
  render() {
    return <div data-testid="show-models">{this.props.models}</div>
  }
}

export class CounterWithOtherContextName extends React.Component<{
  myProp: string,
  myModel: any
}> {
  render() {
    return <div>
      <div data-testid="show-myProp">{this.props.myProp}</div>
      <div data-testid="show-myModel">{this.props.myModel.state.count}</div>
    </div>
  }
}
