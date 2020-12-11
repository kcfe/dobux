import React from 'react'
import { store } from './store'

import './index.less'

const { withProvider, useModel } = store

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
