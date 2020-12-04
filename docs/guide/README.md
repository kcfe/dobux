---
sidebarDepth: 2
---

# 介绍

`Dobux`：轻量级的 **响应式** 状态管理方案

## 特性

- **简单易用**：仅有 3 个核心 API，无需额外的学习成本，只需要了解 `React Hooks`
- **不可变数据源**：通过简单地修改数据与视图进行交互，生成不可变数据源，保证依赖的正确性
- **友好的异步处理**：记录异步操作的加载状态，简化了视图层中的呈现逻辑
- **TypeScript 支持**：完整的 `TypeScript` 类型定义，在编辑器中能获得完整的类型检查和类型推断

## 数据流向

数据的改变发生通常是通过用户交互行为触发的，当此类行为会改变数据的时候可以直接调用 `Reducers` 改变 State ，如果需要执行副作用（比如异步请求）则需要先调用 `Effects`，执行完副作用后再调用 `Reducers` 改变 `State`

<div style="text-align: center">
  <img width="100%" src="/dobux-flow.png" />
</div>

## 核心概念

### Store

在使用 `Dobux` 的应用中允许创建多个 `store` 实例，每个 `store` 实例都会对应一组模型集合，它们之间是相互独立，互不干扰的

通常在一个单页应用中会创建一个全局的 `store` 来存储一些全局的共享状态，与此同时可以针对每一个页面路由乃至每一个组件创建对应的 `store` 将试图与状态分离进行统一管理

### Model

每一个 `Store` 都会包含一个或多个 `Model`（模型），该 `Model` 内会存储视图状态 `state` 以及用于修改它的 `reducer` 以及 `effect`，在视图中最终消费的产物就是这个 `Model`，同一个 `Store` 中的多个 `Model` 之间是可以相互调用的

#### State

`type State = any`

`State` 表示当前模型的状态数据，通常表现为一个 JavaScript 对象（当然它可以是任何值）；操作的时候每次都要当作不可变数据（immutable data）来对待，保证每次都是全新对象，没有引用关系，这样才能保证 `State` 的独立性以及依赖的正确性

```tsx | pure
import { createModel } from 'dobux'

const counter = createModel()({
  state: {
    count: 0,
  },
})
```

#### Reducer

`type Reducer<S, P> = (state: S, ...payload: P) => void`

在 `Dobux` 中所有状态数据的改变都必须通过 `Reducer`，`Reducer` 函数接受多个参数：第一个参数是当前模型最新的状态数据 `state`，后面的所有参数都是调用方传入的参数 `payload`

在 `Reducer` 中你可以通过简单地修改数据就能更新状态并刷新组件视图，同时生成不可变数据源，保证依赖的正确性

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
// modify specify state
reducers.setValue('count', 10)
// batch modify specify state
reducers.setValues({
  count: 10,
})

// reset total state
reducers.reset()
// reset partial state
reducers.reset('count')
```

#### Effect

`type Effect<P> = (...payload: P) => Promise<void>`

`Effect` 被称为副作用，在我们的应用中，最常见的就是异步操作。它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出

在 `Dobux` 中所有副作用处理通过调用 `Effect` 进行，通常会在副作用中处理异步请求以及调用其他模型进行通信

`Dobux` 内置了异步操作 `loading` 态处理，可以简化视图逻辑处理

```ts
import { createModel } from 'Dobux'

const counter = createModel()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state) {
      state.count += 1
    },
  },
  effects: (store, Models) => ({
    async increaseAsync() {
      await wait(2000)
      store.reducers.increase()
    },
  }),
})
```
