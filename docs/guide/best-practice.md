# 最佳实践

对于 `React` 组件化的开发方式，每个组件中不可避免的会管理多个状态，推荐将组件的状态抽离到一个 **model** 文件中通过 `Dobux` 进行接管，这样做的有以下好处：

1. 组件的状态可以集中式的统一管理，逻辑清晰，便于维护和扩展
2. 组件状态的修改通过 `reducer` 进行响应式的编程，生成不可变数据源，避免出现引用类型的问题，保证依赖的正确性
3. 副作用的处理通过 `effects` 统一管控，页面只负责 UI 渲染

`Dobux` 提供了完整的 **Typescript** 支持，推荐使用下面两种方式对代码结构进行组织，这样会避免类型循环引用报错的问题

## 单一 Model

对于简单的业务场景，如单个组件，可以采用单一 `Model` 来对视图的状态进行管理

文件组织结构如下：

```
- List
  - index.less
  - index.tsx
  - model.ts
```

`List/model.ts`

```ts
import { createModel } from '@dobux/store'
import { ModelsType } from '../index'

export const list = createModel<ModelsType, 'list'>()({
  state: {},
  reducers: {},
  effects: (store: ModelsType['list'], Models: ModelsType) => ({}),
})
```

`List/index.tsx`

```tsx
import React from 'react'
import { createStore, Models } from '@dobux/store'
import * as models from './model'

import './index.less'

export type ModelsType = Models<typeof models>

const store = createStore(models)
const { withProvider } = store

const List: React.FC = () => {
  return <div>This is page list</div>
}

export default withProvider(List)
```

## 多 Model

对于复杂的业务场景可以使用多 `Model` 模式，根据组件的颗粒度进行 `Model` 的拆分然后在入口处统一注入，多个 `Model` 之间可以通过 `effects` 的第二个参数 `Models` 相互调用，通过分层的设计降低单一 `Model` 的复杂度，提高应用的可插拔能力

文件组织结构如下：

```
- List
  - CompA
    - index.tsx
    - index.less
    - model.ts
  - CompB
    - index.tsx
    - index.less
    - model.ts
  - CompC
    - index.tsx
    - index.less
    - model.ts
  - index.tsx
  - models.ts
  - store.ts
```

`List/CompA/model.ts`

```ts
import { createModel } from '@dobux/store'
import { ModelsType } from '../store'

export const compA = createModel<ModelsType, 'compA'>()({
  state: {},
  reducers: {},
  effects: (store: ModelsType['compA'], Models: ModelsType) => ({}),
})
```

`List/CompB/model.ts`

```ts
import { createModel } from '@dobux/store'
import { ModelsType } from '../store'

export const compB = createModel<ModelsType, 'compB'>()({
  state: {},
  reducers: {},
  effects: (store: ModelsType['compB'], Models: ModelsType) => ({}),
})
```

`List/CompC/model.ts`

```ts
import { createModel } from '@dobux/store'
import { ModelsType } from '../store'

export const compC = createModel<ModelsType, 'compC'>()({
  state: {},
  reducers: {},
  effects: (store: ModelsType['compC'], Models: ModelsType) => ({}),
})
```

`List/models.ts`

```ts
export { compA } from './CompA/model'
export { compB } from './CompB/model'
export { compC } from './CompC/model'
```

`List/store.ts`

```ts
import { createStore, Models } from '@dobux/store'
import * as models from './models'

export type ModelsType = Models<typeof models>

const store = createStore(models)

export default store
```

`List/index.tsx`

```tsx
import React from 'react'
import CompA from './CompA'
import CompB from './CompB'
import CompC from './CompC'

import store from './store'

const { Provider } = store

const List: React.FC = () => {
  return (
    <Provider>
      <CompA />
      <CompB />
      <CompC />
    </Provider>
  )
}

export default List
```
