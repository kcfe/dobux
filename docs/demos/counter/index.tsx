import React from 'react'
import { createStore, Models } from 'dobux'
import * as models from './model'

import './index.less'

export type RootModel = Models<typeof models>

// 创建 store 实例
const { withProvider, useModel } = createStore(models)

const Counter: React.FC = () => {
  const { state, reducers, effects } = useModel('counter')

  const handleIncrease = () => {
    reducers.increase()
  }

  const handleDecrease = () => {
    reducers.decrease()
  }

  const handleSetValue = () => {
    reducers.setValue('count', state.count + 2)
  }

  const handleSetValues = () => {    
    reducers.setValues({
      count: state.count - 2
    })
  }

  const handleReset = () => {
    reducers.reset()
  }

  const handleAsync = () => {
    effects.increaseAsync()
  }

  if (effects.increaseAsync.loading) {
    return <p className="loading">loading ...</p>
  }

  return (
    <div className="counter">
      <p>The count is: {state.count}</p>
      <button onClick={handleIncrease}>+</button>
      <button onClick={handleDecrease}>-</button>
      <button onClick={handleSetValue}>setValue</button>
      <button onClick={handleSetValues}>setValues</button>
      <button onClick={handleAsync}>async</button>
      <button onClick={handleReset}>reset</button>
    </div>
  )
}

export default withProvider(Counter)
