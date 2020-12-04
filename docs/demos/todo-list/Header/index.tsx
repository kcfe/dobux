import React, { ChangeEvent, KeyboardEvent } from 'react'
import { store } from '../store'

function Header() {
  const { state, reducers, effects } = store.useModel('header')

  const handleChange = (e: ChangeEvent<{ value: string }>) => {
    reducers.changeValue(e.target.value)
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (state.value && e.keyCode === 13) {
      effects.addUndoItem()
      reducers.changeValue('')
    }
  }

  return (
    <div className="header">
      <div className="content">
        TodoList
        <input
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          value={state.value}
          placeholder="Todo"
        />
      </div>
    </div>
  )
}

export default Header
