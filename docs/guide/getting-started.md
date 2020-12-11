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

## 目录结构

```
- Counter
  - index.tsx
  - model.ts
```

[点击查看完成示例](/guide/examples#简单的计数器)

## 定义模型

通过调用 `createModel` 来创建一个 `Dobux Model`。每个 `Model` 由三部分组成：

- `state: any`：当前模型的状态数据，可以是任意值，通常是一个 JavaScript 对象，必传
- `reducers?: object`：修改模型状态的同步方法，可以包含多个改变状态的函数，非必传
- `effects?: (model, rootModel) => object`：用于处理副作用，其中 `model` 表示当前使用 `createModel` 生成的模型；`rootModel` 表示当前 `store` 下的所有模型，非必传

```ts
// model.ts
import { createModel } from 'dobux'
import { RootModel } from './index'

export const counter = createModel<RootModel, 'counter'>()({
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
```

## 消费模型

通过调用 `createStore` 传入多个自定义模型会创建一个 `Store` 的实例，该实例上包含了以下属性：

- `Provider: React.FC`：函数组件，生成的多个 `Model` 实例会挂载在该组件的内部供 `useModel` 使用
- `withProvider: React.FC`：高阶函数，生成的多个 `Model` 实例会挂载在该组件的内部供 `useModel` 使用
- `useModel: (modelName: string) => { state, reducers, effects }`：在函数组件内部可以通过模型的唯一名称获取指定的 `model` 进行消费

```tsx | pure
// index.tsx
import React from 'react'
import { createStore, Models } from 'dobux'
import * as models from './model'

export type RootModel = Models<typeof models>

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

  return (
    <div className="counter">
      <p>The count is: {state.count}</p>
      <button onClick={handleIncrease}>+</button>
      <button onClick={handleDecrease}>-</button>
    </div>
  )
}

export default withProvider(Counter)
```

> 注：在 `index.tsx` 中导出 `RootModel` 类型仅仅是为了 ts 类型约束的类型推断，[详见](/guide/faq#实例化-store-时为什么要对-model-进行循环引用？)
