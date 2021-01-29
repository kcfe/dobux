---
order: 1
---

# 介绍

`Dobux` 是基于 React Context 和 React Hooks 的 **轻量级响应式** 状态管理方案

## 特性

- **🎉 简单易用**：仅有 3 个核心 API，无需额外的学习成本，只需要了解 `React Hooks`
- **🚀 不可变数据**：通过简单地修改数据与视图交互，同时保留不可变数据的特性
- **🌲 灵活的使用方式**：支持全局和局部数据源，更优雅的管理整个应用的状态
- **🍳 友好的异步处理**：记录异步操作的加载状态，简化了视图层中的呈现逻辑
- **🍬 TypeScript 支持**：完整的 `TypeScript` 类型定义，在编辑器中能获得完整的类型检查和类型推断

## 核心概念

### Model

对于 `React` 这种组件化的开发方式，一个页面通常会抽象为多个组件，每个组件可能会维护多个内部状态用于控制组件的表现行为。在组件内部还会存在一些副作用的调用，最常见的就是 `Ajax` 请求。在 `Dobux` 中我们将这一组内部状态、用于修改内部状态的方法以及副作用处理函数的组合称为 **Model（模型）**

在 `Dobux` 中 `Model` 是最基本的单元，下面分别介绍了 `Model` 的三个组成部分：

#### State

`type State = any`

`State` 保存了当前模型的状态，通常表现为一个 JavaScript 对象（当然它可以是任何值）；操作的时候每次都要当作不可变数据（immutable data）来对待，保证每次都是全新对象，没有引用关系，这样才能保证 `State` 的独立性以及依赖的正确性

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

在 `Dobux` 中所有模型状态的改变都必须通过 `Reducer`，它是一个同步执行的函数，在调用时会传入以下几个参数：

- `state`：当前模型的最新状态
- `...payload: any[]`：调用方传入的多个参数

  **响应式** 体现在对于每一个 `Reducer` 在函数体中可以通过简单地修改数据就能更新状态并刷新组件视图，同时生成不可变数据源，保证依赖的正确性

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

为了简化状态修改逻辑同时避免用户重复的编写常用 `reducer` 的类型约束，`Dobux` 内置了名为 `setValue`、`setValues` 和 `reset` 的 `Reducer`

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

`Effect` 被称为副作用，它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出

在 `Dobux` 中副作用处理通过调用 `Effect` 执行，通常会在副作用中发送异步请求或者调用其他模型（通过 `rootModel` 可以调用其他模型）

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

`Dobux` 内置了异步操作 `loading` 态处理，在视图中通过 `effects.effectName.loading` 就可以获取当前副作用的 `loading` 状态，简化了视图逻辑处理

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

### Store

在 `Dobux` 中 `Model` 不能独立的完成状态的管理和共享。`Store` 作为 `Model` 的载体可以赋予它这部分的能力。每一个 `Store` 都会包含一个或多个 `Model`，同一个 `Store` 下的一组 `Model` 之间是相互独立、互不干扰的

一个应用可以创建多个 `Store`（全局和局部数据源），它们之间也是相互独立、互不干扰的

```ts
import { createModel, createStore } from 'dobux'

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

const store = createStore({
  counter,
})
```

## 数据流向

数据的改变发生通常是通过用户交互行为触发的，当此类行为触发需要对模型状态修改的时候可以直接调用 `Reducers` 改变 `State` ，如果需要执行副作用（比如异步请求）则需要先调用 `Effects`，执行完副作用后再调用 `Reducers` 改变 `State`

<div style="text-align: center">
  <img width="800px" src="/dobux/dobux-flow.png" />
</div>
