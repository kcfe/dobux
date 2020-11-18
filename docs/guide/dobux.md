# Dobux

## 简单计数器实现

```tsx
import React from 'react';
import Store from '@dobux/store'

// 1. Store
const store = createStore({
  counter: {
    state: {
      count: 0,
    },
    reducers: {
      increase(state) {
        state.count++
      },
      decrease(count) {
        state.count--
      },
    },
    effects: (store, Models) => ({
      async increaseAsync() {
        await wait(2000)
        store.reducers.increase()
      },
    }),
  },
})

// 2. Provider
const { Provider } = store
const App = () => {
  return (
    <Provider>
      <Counter />
    </Provider>
  )
}

// 3. View
const Counter = () => {
  const { state, reducers, effects } = store.useModel('counter')
  return (
    <div>
      <h2>{state.count}</h2>
      <button
        key="increase"
        onClick={() => {
          reducers.increase()
        }}
      >
        +
      </button>
      <button
        key="decrease"
        onClick={() => {
          reducers.decrease()
        }}
      >
        -
      </button>
      <button
        key="increaseAsync"
        onClick={() => {
          effects.increaseAsync()
        }}
      >
        async
      </button>
    </div>
}
```

## 数据源

`Dobux` 既支持单一 `Model` 注入同时支持多 `Model` 注入，对于某些复杂的业务场景，通过多 `Model` 的设计分层可以将页面的状态数据按照组件纬度拆分，同时提供通信的方式避免了单一 `Model` 的复杂性

```
- pages
  - Index
    - AccountTable
    - OrderTable
    - index.tsx
  - Order
    - CommonInfo
    - ExtraInfo
    - index.tsx
```

比如，对于这样一个单页应用，项目结构如上，整个项目包含了两个路由

- 首页：包含账户列表和订单列表两个组件
- 订单页：包含订单基本信息和额外信息两个组件

使用 `Dobux` 进行数据拆分可以按照如下方式进行：

- account model：`pages/Index/AccountTable/model.ts`

```ts
export const account = {
  state: {},
  reducers: {},
  effects: () => ({}),
}
```

- order model：`pages/Index/OrderTable/model.ts`

```ts
export const order = {
  state: {},
  reducers: {},
  effects: () => ({}),
}
```

- 在页面的入口文件组合和注入：`pages/Index/store.ts`

```ts
import Store from '@dobux/store'
import { account } from './AccountTable/model.js'
import { order } from './OrderTable/model.js'

const store = createStore({
  account,
  order,
})

export default store
```

- 挂载实例：`pages/Index/index.tsx`

```js
import AccountTable from './AccountTable'
import OrderTable from './OrderTable'
import store from './store.ts'

const { Provider } = store

const Index = () => {
  return (
    <Provider>
      <AccountTable />
      <OrderTable />
    </Provider>
  )
}
```

多 `Model` 的设计在这种场景下的优势有以下几点：

- 数据源之间是相互隔离的，任何一个数据源的改变不会影响其他数据源的视图
- 以组件的颗粒度进行拆分，避免了单一模型的臃肿
- 模型以就近原则的方式组织便于维护

## Reducer

`Dobux` 内置了不可变数据源，不需要自己手动处理返回全新的数据，这意味着可以通过简单地修改数据而与数据进行交互

```ts
{
  reducers: {
    changeData(state) {
      state.a.b = 1
      state.a.c.push(2)
    },
  },
}
```

## Effect

`Dobux` 在副作用的处理上可以优雅的使用 `async await` 语法，同时内置了 `loading` 状态的处理，避免了手动处理需要的样板代码

```tsx
if (effects.increaseAsync.loading) {
  return <p className="loading">loading ...</p>
}
```

## TypeScript 支持

`Dobux` 提供完整的 `TypeScript` 类型定义，在编辑器中能获得完整的类型检查和类型推断

- `useModel`

<div style="text-align: center">
  <img width="80%" src="/useModel.png" />
</div>

- `state`

<div style="text-align: center">
  <img width="80%" src="/state.png" />
</div>

- `reducers`

<div style="text-align: center">
  <img width="80%" src="/reducers.png" />
</div>

- `effects`

<div style="text-align: center">
  <img width="80%" src="/effects.png" />
</div>
