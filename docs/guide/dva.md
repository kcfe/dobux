# Dva

## 简单计数器实现

```tsx
import React from 'react'
import dva, { connect } from 'dva'

// 1. Initialize
const app = dva()

// 2. Model
app.model({
  namespace: 'count',
  state: 0,
  reducers: {
    increase(count) {
      return count + 1
    },
    decrease(count) {
      return count - 1
    },
  },
  effects: {
    *increaseAsync(action, { put, call }) {
      yield call(delay, 2000)
      yield put({ type: 'increase' })
    },
  },
})

// 3. View
const App = connect((state: any) => ({ count: state.count }))((props: any) => {
  return (
    <div>
      <h2>{props.count}</h2>
      <button
        key="increase"
        onClick={() => {
          props.dispatch({ type: 'count/increase' })
        }}
      >
        +
      </button>
      <button
        key="decrease"
        onClick={() => {
          props.dispatch({ type: 'count/decrease' })
        }}
      >
        -
      </button>
      <button
        key="increaseAsync"
        onClick={() => {
          props.dispatch({ type: 'count/increaseAsync' })
        }}
      >
        async
      </button>
    </div>
  )
})

// 4. Router
app.router(() => <App />)

// 5. Start
app.start('#root')
```

## 数据源

`dva` 提供单一 `Store` 的注入形式，随着业务的复杂性势必会导致单一数据源的复杂性

## Reducer

`dva` 内部依赖了 `redux`，因此它的的 `Reducer` 也必须是纯函数，需要自己手动处理返回全新的数据保证数据的不可变性

## Effect

`dva` 副作用的处理通过 `redux-saga`，使用 `Generator` 语法，相比于 `async await` 不够优雅

## TypeScript 支持

由于 `Action` 的字符串设计，在调用 `dispatch` 时不能提供友好的类型约束及提示
