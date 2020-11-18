# 快速上手

::: warning 注意
请确保你的 React 版本 >= 16.8.0
:::

## 安装

- 使用 `yarn`

```bash
$ yarn add @dobux/store@alpha
```

- 使用 `npm`

```bash
$ npm i @dobux/store@alpha --save
```

**业务诉求需要多 Model 共享状态？[点击查看多 Model 实践](/guide/best-practice.html#多-model)**

## 目录结构

```
- Counter
  - index.tsx
  - model.ts
```

## 定义模型

一个 `Dobux` 模型（model）由三个部分组成，它们分别是 `state`，`reducers` 以及 `effects`，其中 `state` 保存了当前模型的状态，`reducers` 是用户改变 `state` 的唯一方式，`effects` 用于处理副作用

```ts
// model.ts
import { createModel } from '@dobux/store'
import { ModelsType } from './index'

const state = {
  count: 0,
}

type State = typeof state

export const counter = createModel<ModelsType, 'counter'>()({
  state,
  reducers: {
    increase(state: State) {
      state.count += 1
    },
    decrease(state: State) {
      state.count -= 1
    },
  },
  effects: (store: ModelsType['counter'], Models: ModelsType) => ({
    async increaseAsync() {
      await wait(2000)
      store.reducers.increase()
    },
  }),
})
```

## 消费模型

通过构造函数 `createStore` 传入自定义的模型会创建一个 `Store` 的实例，该实例上包含了模型的承载组件 `withProvider（Provider）`，以及 **hook style** 的 API `useModel`，在函数组件内部可以通过模型的唯一名称获取指定的 `model` 进行消费

```tsx
// index.tsx
import React from 'react'
import { createStore, Models } from '@dobux/store'
import * as models from './model'

export type ModelsType = Models<typeof models>

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
    reducers.setValue('count', 10)
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
      <button onClick={handleAsync}>async</button>
    </div>
  )
}

// 通过 withProvider 获取挂载在 Context 上的所有 model 实例
export default withProvider(Counter)
```

> 注：在 `index.tsx` 中导出 `ModelsType` 仅仅是为了 ts 类型推断，[详见](/guide/faq.html#实例化-store-时为什么要对-model-进行循环引用？)

![](/counter.gif)
