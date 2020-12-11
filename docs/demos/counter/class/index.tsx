import React from 'react'
import { createStore, Models } from 'dobux'
import * as models from './model'

import './index.less'

export type RootModel = Models<typeof models>

export interface CounterProps {
  state: RootModel['counter']['state']
  reducers: RootModel['counter']['reducers']
  effects: RootModel['counter']['effects']
}

// 创建 store 实例
const { withProvider, withModel } = createStore(models)

class Counter extends React.Component<CounterProps> {
  handleIncrease = () => {
    const { reducers } = this.props
    reducers.increase()
  }

  handleDecrease = () => {
    const { reducers } = this.props
    reducers.decrease()
  }

  handleSetValue = () => {
    const { state ,reducers } = this.props
    reducers.setValue('count', state.count + 2)
  }

  handleSetValues = () => {
    const { state, reducers } = this.props
    reducers.setValues({
      count: state.count - 2
    })
  }

  handleAsync = () => {
    const { effects } = this.props
    effects.increaseAsync()
  }

  handleReset = () => {
    const { reducers } = this.props
    reducers.reset('count')
  }

  render() {
    const { state, effects } = this.props

    if (effects.increaseAsync.loading) {
      return <p className="loading">loading ...</p>
    }

    return (
      <div className="counter">
        <p>The count is: {state.count}</p>
        <button onClick={this.handleIncrease}>+</button>
        <button onClick={this.handleDecrease}>-</button>
        <button onClick={this.handleSetValue}>setValue</button>
        <button onClick={this.handleSetValues}>setValues</button>
        <button onClick={this.handleAsync}>async</button>
        <button onClick={this.handleReset}>reset</button>
      </div>
    )
  }
}

export default withProvider(withModel('counter')(Counter))
