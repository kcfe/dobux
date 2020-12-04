import React from 'react'
import Header from './Header'
import UndoList from './UndoList'
import { store } from './store'

import './index.less'

const { Provider } = store

const TodoList: React.FC = () => {
  return (
    <Provider>
      <div className="todo-list">
        <Header />
        <UndoList />
      </div>
    </Provider>
  )
}

export default TodoList
