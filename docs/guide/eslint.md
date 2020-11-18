# Eslint

`Dobux` 概念中 `state` 的修改只能在 `Reducer` 中进行，为了方便业务使用，在 `Effect` 中透出了 `state` 提供使用，为了避免随意修改 `state` 引起不可预知的错误建议安装 `eslint` 插件来规范化编码行为

## 安装

- 使用 `yarn`

```bash
$ yarn add eslint-plugin-dobux --dev
```

- 使用 `npm`

```bash
$ npm install eslint-plugin-dobux --save-dev
```

## 配置

```json
// .eslintrc
{
  "extends": ["react-app", "plugin:dobux/recommended"],
  "plugins": ["dobux"]
}
```

## 规则

### no-modify-state-in-effect

**Succeed**

```ts
export const counter = {
  state,
  reducers: {
    increase(state: State) {
      state.count++
    },
    decrease(store: any) {
      state.count--
      store.state.count++
    },
  },
  effects: (store: ModelsType['counter'], Models: ModelsType) => ({
    async increaseAsync() {
      await wait(500)
      store.state.count = 10
      store.reducers.increase()
    },
  }),
}
```

**Fail**

```ts
export const counter = {
  state,
  reducers: {
    increase(state: State) {
      state.count++
    },
    decrease(store: any) {
      state.count--
      store.state.count++
    },
  },
  effects: (store: ModelsType['counter'], Models: ModelsType) => ({
    async increaseAsync() {
      await wait(500)
      store.state.count++
      store.state.count--
      store.reducers.increase()
    },
  }),
}
```

### no-modify-state-in-function-component

**Succeed**

```ts
import React, { FC } from 'react'
import store from './store'

const Count: FC = () => {
  const { state, reducers, effects } = store.useModel('counter')
  const handleIncrease = () => {
    reducers.increase()
  }
  const handleDecrease = () => {
    reducers.decrease()
  }
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={handleIncrease}>increase</button>
      <button onClick={handleDecrease}>decrease</button>
    </div>
  )
}
export default Count
```

**Fail**

```ts
import React, { FC } from 'react'
import store from './store'

const Count: FC = () => {
  const { state, reducers, effects } = store.useModel('counter')

  state.count++
  state.count = 123

  return <div></div>
}

export default Count
```
