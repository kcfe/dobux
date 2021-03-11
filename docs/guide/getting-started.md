---
order: 2
---

# 快速上手

<Alert>Tips: 请确保你的 React 版本 >= **16.8.0**</Alert>

## 安装

```bash
// 使用 npm
$ npm i dobux --save

// 使用 yarn
$ yarn add dobux
```

## 基本使用

```jsx | pure
import { createModel, createStore } from 'dobux'

// 1. 创建 Model
export const counter = createModel()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state) {
      state.count += 1
    },
    decrease(state) {
      state.count -= 1
    },
  },
  effects: (model, rootModel) => ({
    async increaseAsync() {
      await wait(2000)
      model.reducers.increase()
    },
  }),
})

// 2. 创建 Store
const store = createStore({
  counter,
})

// 3. 挂载模型
const { Provider, useModel } = store

function App() {
  return (
    <Provider>
      <Counter />
    </Provider>
  )
}

// 4. 消费模型
function Counter() {
  const { state, reducers, effects } = useModel('counter')

  const handelIncrease = () => {
    reducers.increase()
  }

  const handelDecrease = () => {
    reducers.decrease()
  }

  const handelIncreaseAsync = () => {
    reducers.increaseAsync()
  }

  // 当异步请求 `increaseAsync` 执行时 `loading` 会设置为 true，显示 loading
  if (effects.increaseAsync.loading) {
    return <p className="loading">loading ...</p>
  }

  return (
    <div>
      <div>The count is：{state.count}</div>
      <button onClick={handelIncrease}>+</button>
      <button onClick={handelDecrease}>-</button>
      <button onClick={handelIncreaseAsync}>async</button>
    </div>
  )
}
```

[点击查看 Typescript 示例](/guide/examples#简单的计数器)
