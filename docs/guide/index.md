---
order: 1
---

# 介绍

`Dobux`：轻量级 **响应式** 状态管理方案

## 特性

- **🎉 简单易用**：仅有 3 个核心 API，无需额外的学习成本，只需要了解 `React Hooks`
- **🌲 全局和局部数据源**：同时支持全局和局部数据源，更优雅的管理整个应用的状态
- **🚀 不可变数据源**：通过简单地修改数据与视图进行交互，生成不可变数据源，保证依赖的正确性
- **🍳 友好的异步处理**：记录异步操作的加载状态，简化了视图层中的呈现逻辑
- **🍬 TypeScript 支持**：完整的 `TypeScript` 类型定义，在编辑器中能获得完整的类型检查和类型推断

## 核心概念

### Store

在使用 `Dobux` 的应用中允许创建多个 `store` 实例。它可以用于管理一些全局共享的状态，比如用户信息、用户权限等；同时可以管理一个路由下多个组件的共享状态；还可以单独管理一个组件的状态。每个 `store` 实例都会对应一组模型集合，它们之间是相互独立，互不干扰的

### Model

每一个 `Store` 都会包含一个或多个 `Model`（模型）。每个 `Model` 会与一个组件（多个共享组件）的共享状态 `state` 对应起来，同时包含了用于触发状态变更的 `reducers` 以及 `effects`，在组件视图中最终消费的产物就是这个 `Model`，同一个 `Store` 中的多个 `Model` 之间是可以相互调用的

#### State

`type State = any`

`State` 保存了当前模型的数据状态，通常表现为一个 JavaScript 对象（当然它可以是任何值）；操作的时候每次都要当作不可变数据（immutable data）来对待，保证每次都是全新对象，没有引用关系，这样才能保证 `State` 的独立性以及依赖的正确性

```ts
import { createModel } from 'dobux'

const counter = createModel()({
  state: {
    count: 0,
  },
})
```

#### Reducer

`type Reducer<S, P> = (state: S, ...payload: P) => void`

在 `Dobux` 中所有数据状态的改变都必须通过 `Reducer`，它是一个同步执行的函数，接受多个参数

- `state`：当前模型的最新状态
- `...payload: any[]`：调用方传入的多个参数

在 `Reducer` 中可以通过简单地修改数据就能更新状态并刷新组件视图，同时生成不可变数据源，保证依赖的正确性

```ts
import { createModel } from 'dobux'

const counter = createModel()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state) {
      state.count += 1
    },
  },
})
```

`Dobux` 内置了名为 `setValue`、`setValues` 和 `reset` 的 `Reducer`，可以简化状态修改逻辑

```ts
// modify state specially
reducers.setValue('count', 10)
// batched modify state
reducers.setValues({
  count: 10,
})

// reset whole state
reducers.reset()
// reset partial state
reducers.reset('count')
```

#### Effect

`type Effect<P> = (...payload: P) => Promise<void>`

`Effect` 被称为副作用，在我们的应用中，最常见的就是异步操作。它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出

在 `Dobux` 中所有副作用处理通过调用 `Effect` 执行，通常会在副作用中发送异步请求或者调用其他模型

```ts
import { createModel } from 'dobux'

const counter = createModel()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state) {
      state.count += 1
    },
  },
  effects: (model, rootModel) => ({
    async increaseAsync() {
      await wait(2000)
      model.reducers.increase()
    },
  }),
})
```

`Dobux` 内置了异步操作 `loading` 态处理，在视图中可以通过 `effects.xxx.loading` 就能获取当前副作用的 `loading` 状态，简化了视图逻辑处理

```tsx | pure
const Counter: React.FC = () => {
  const { state, reducers, effects } = useModel('counter')

  const handleIncrease = () => {
    reducers.increase()
  }

  const handleDecrease = () => {
    reducers.decrease()
  }

  const handleIncreaseAsync = () => {
    reducers.increaseAsync()
  }

  if (effects.increaseAsync.loading) {
    return <div>Loading ...</div>
  }

  return (
    <div className="counter">
      <p>The count is: {state.count}</p>
      <button onClick={handleIncrease}>+</button>
      <button onClick={handleDecrease}>-</button>
      <button onClick={handleIncreaseAsync}>async</button>
    </div>
  )
}
```

## 数据流向

数据的改变发生通常是通过用户交互行为触发的，当此类行为会改变数据的时候可以直接调用 `Reducers` 改变 State ，如果需要执行副作用（比如异步请求）则需要先调用 `Effects`，执行完副作用后再调用 `Reducers` 改变 `State`

<div style="text-align: center">
  <img width="800px" src="/dobux-flow.png" />
</div>
