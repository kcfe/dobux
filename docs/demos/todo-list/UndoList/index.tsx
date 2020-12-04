import React from 'react'
import { store } from '../store'

function UndoList() {
  const { state, reducers, effects } = store.useModel('undoList')

  const handleClick = (index: number) => {
    reducers.deleteItem(index)
  }

  const handleToggle = (index: number) => {
    reducers.toggleItem(index)
  }

  if (effects.fetchUndoList.loading) {
    return <div className="loading">loading ...</div>
  }

  return (
    <div className="undo-list">
      <h2 className="title">
        正在进行 <div className="count">{state.items.filter((item: any) => !item.done).length}</div>
      </h2>
      <ul className="content">
        {state.items.map((item: any, index: number) => {
          return (
            !item.done && (
              <li onClick={() => handleToggle(index)} className="item" key={index}>
                {item.content}
                <div
                  onClick={e => {
                    e.stopPropagation()
                    handleClick(index)
                  }}
                  className="delete"
                >
                  -
                </div>
              </li>
            )
          )
        })}
      </ul>
      <h2 className="title" style={{ marginTop: 30 }}>
        已经完成{' '}
        <div className="count" data-test="count">
          {state.items.filter((item: any) => item.done).length}
        </div>
      </h2>
      <ul className="content">
        {state.items.map((item: any, index: number) => {
          return (
            item.done && (
              <li onClick={() => handleToggle(index)} className="item" key={index}>
                {item.content}
                <div
                  onClick={e => {
                    e.stopPropagation()
                    handleClick(index)
                  }}
                  className="delete"
                >
                  -
                </div>
              </li>
            )
          )
        })}
      </ul>
    </div>
  )
}

export default UndoList
