---
# https://d.umijs.org/zh-CN/config/frontmatter
order: 1
nav:
  order: 2
  title: API
toc: menu
---

# API

## `createModel(model)`

创建一个 `Dobux` 模型，一个 model 包含如下三个属性

### model.state

`state: any`

当前模型的初始状态，必传

```tsx | pure
const model = {
  state: {
    count: 0,
  },
}
```

### model.reducers

`reducers?: { [string]: (state: State, ...payload: any) => void }`

模型状态的修改必须通过 `reducer` 进行，必传。调用该函数会默认传入以下参数：

- `state`：当前模型最新的状态，直接修改会生成一个新的对象并触发组件更新
- `payload`：调用该 `reducer` 时传入的参数，支持传入多个

```tsx | pure
const model = {
  state: {
    count: 0,
  },
  reducers: {
    increase(state: State, payload: any) {
      state.count += 1
    },
    decrease(state: State, a: number, b?: number) {
      state.count -= 1
    },
  },
}
```

`@dobux/store` 提供了三个内置的 `reducer`，可以很方便进行状态修改，比如更新表单的字段

- `reducers.setValue(key: K extends keyof State, value: State[K])`

```tsx | pure
// modify specify field
reducers.setValue('count', 10)
```

- `reducers.setValues(partialState: Partial<State>)`

```tsx | pure
// batch modify specify field
reducers.setValues({
  count: 5,
  ...
})
```

- `reducers.reset(key?: K extends keyof State)`

```tsx | pure
// reset total state
reducers.reset()

// reset specify state
reducers.reset('count')
```

### model.effects

`effects: (store: Store, rootStore: RootStore) => { [name:string]: (...payload: any) => Promise<void> }`

所有的副作用函数都需要在 `effects` 中处理，调用该函数会默认传入以下参数：

- `store`：当前模型实例
  - `store.state`
  - `store.reducers`
  - `store.effects`
- `rootStore`：整个 `Store` 的模型实例
  - `{ [namespace: string]: { state, reducers, effects } }`
- `payload`：调用该 `effect` 时传入的参数，支持传入多个

```tsx | pure
const model = {
  state: {
    count: 0,
  },
  reducers: {
    increase(state: State) {
      state.count += 1
    },
  },
  effects: (store: Store, rootStore: RootStore) => ({
    async increaseAsync(payload: number) {
      await wait(1000)
      store.reducers.increase()
    },
  }),
}
```

## `store = createStore(models)`

用于创建一个 `Store` 实例，其中 `models` 是一个对象，它的 `key` 值为命名空间，在组件内调用 `useModel(key)` 消费数据时传入，`value` 为每一个命名空间下的模型配置项 `model`

```tsx | pure
import { createStore } from '@dobux/store'

interface State {
  count: number
}

const store = createStore({
  counter: {
    state: {
      count: 0,
    },
    reducers: {
      increase(state: State, payload: number, store) {
        state.count += 1
      },
      decrease(state: State, payload: number, store) {
        state.count -= 1
      },
    },
    effects: {
      async increaseAsync(payload: number, store) {
        await wait(2000)
        store.reducers.increase()
      },
    },
  },
})
```

### `store.Provider`

`Provider(props: { children: ReactElement, autoReset?: boolean, devTools? boolean })`

通过 `Provider` 将 `Store` 实例挂载到 `React` 应用，以便组件能够通过 `Hooks` 的方式进行交互

- `props.children`：使用 store 的子节点
- `props.autoReset`：是否在组件卸载的时候将数据重置为默认值，默认为 `false`
- `props.devTools`：是否在开发环境链接 redux devtools，默认为 `true`

```tsx | pure
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'

const { Provider } = store

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

### `store.withProvider`

`withProvider(FunctionComponent, options?: { autoReset?: boolean, devTools?: boolean }): ReactElement`

- `options.autoReset`：是否在组件卸载的时候将数据重置为默认值，默认为 `false`
- `options.devTools`：是否在开发环境链接 redux devtools，默认为 `true`

使用 `Provider` 时模型实例只能在子组件内部 `useModel` 的时候拿到，对于一些特殊的业务场景希望在当前组件中获取模型实例并修改状态可以使用高阶组件 `withProvider`

```tsx | pure
import { Tabs } from 'antd'
import store from './store'

const { withProvider } = store
const { TabPane } = Tabs

export interface Props
  extends RouteComponentProps<{
    type: 'list' | 'product'
  }> {}

function App(props: Props) {
  const { reducers: adPositionReducers } = store.useModel('adPosition')
  const { reducers: productReducers } = store.useModel('product')

  const onChange = (activeKey: string) => {
    switch (activeKey) {
      case 'list':
        adPositionReducers.setValue('searchParams', adPositionInitialState.searchParams)
        break
      case 'product':
        productReducers.setValue('searchParams', productInitialState.searchParams)
        break
    }
  }

  return (
    <div className="app">
      <Tabs activeKey={props.match.params.type} onChange={onChange} animated={false}>
        <TabPane tab="广告位管理" key="list">
          {type === 'list' ? <AdPosition /> : null}
        </TabPane>
        <TabPane tab="产品管理" key="product">
          {type === 'product' ? <Product /> : null}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default withRouter(withProvider(App))
```

### `store.useModel`

`useModel: (modelName: string, mapStateToProps?: (state: State) => any ) => { state, reducers, effects }`

通过该 API 在组件内获取模型实例，接受两个参数：

- `modelName`：执行 `createStore(models)` 时传入的对象 `key` 值，必传
- `mapStateToProps`：接受当前模型原始的 `state` 为参数，返回一个自定义的对象，表示当前组件只有在这个返回对象改变时才会 **re-render** 用于性能优化，阻止不必要的渲染，非必传

返回结果的信息如下：

- `state`：当前组件依赖的模型状态
- `reducers`：当前组件可用于修改模型状态的方法
- `effects`：当前组件可用于执行副作用的方法，比如调用异步请求，其中 `effects.effectName.loading` 记录了异步操作时的状态，可以简化视图层逻辑

#### 基本用法

```tsx | pure
import React, { FC } from 'react'
import store from './store'

const Counter: FC = () => {
  const { state, reducers, effects } = store.useModel('counter')

  if (effects.increaseAsync.loading) {
    return <div>loading ...</div>
  }

  return <div>Count: {state.count}</div>
}
```

#### 性能优化

在某些组件中可能只需要依赖某一数据源的部分状态，同时只有当这部分依赖的状态变化时才会重新渲染，可以通过 `useModel` 第二个参数的 `mapStateToProps` 属性进行控制

```tsx | pure
import React, { FC } from 'react'
import store from './store'

const Counter: FC = () => {
  const { state, reducers, effects } = store.useModel('counter', state => {
      // 只有当数据源 `counter` 中的 `state.count` 改变时才会触发当前组件的 re-render
      return {
        count: state.count,
      }
    },
  })

  if (effects.increaseAsync.loading) {
    return <div>loading ...</div>
  }

  return <div>Count: {state.count}</div>
}
```

### `store.withModel`

`withModel: (namespace: string, mapStateToProps?: (state: State) => any) => (Component) => React.ComponentType`

对于 Class Component 可以通过 `withModel` 高阶组件进行数据源的交互，该组件接受两个参数

- `namespace`：执行 `createStore(models)` 时传入的对象 `key` 值，必传
- `mapStateToProps`：接受当前模型原始的 `state` 为参数，返回一个自定义的对象，表示当前组件只有在这个返回对象改变时才会 **re-render** 用于性能优化，阻止不必要的渲染，非必传

调用该高阶组件会在传入组件的 `props` 上挂载以下三个属性：

- `props.state`：当前组件依赖的模型状态
- `props.reducers`：当前组件可用于修改模型状态的方法
- `props.effects`：当前组件可用于执行副作用的方法，比如调用异步请求，其中 `effects.effectName.loading` 记录了异步操作时的状态，可以简化视图层逻辑

#### 基本用法

```tsx | pure
import store, { RootStoreType } from './store'

const { withModel } = store

interface Props {
  state: RootStoreType['counter']['state']
  reducers: RootStoreType['counter']['reducers']
  effects: RootStoreType['counter']['effects']
}

class Count extends React.Component<Props> {
  handleIncrease = () => {
    const { reducers } = this.props
    reducers.increase()
  }

  handleDecrease = () => {
    const { reducers } = this.props
    reducers.decrease()
  }

  render() {
    const { state, effects } = this.props

    if (effects.increaseAsync.loading) {
      return <p className="loading">loading ...</p>
    }

    return (
      <div className="counter">
        <p>The count is: {state.count}</p>
        <button onClick={this.handleIncrease}>+</button>
        <button onClick={this.handleDecrease}>-</button>
      </div>
    )
  }
}

export default withModel('counter')(Count)
```

#### 性能优化

在某些组件中可能只需要依赖某一数据源的部分状态，同时只有当这部分依赖的状态变化时才会重新渲染，可以通过 `withModel` 第二个参数的 `mapStateToProps` 属性进行控制

```tsx | pure
import store, { RootStoreType } from './store'

const { withModel } = store

interface Props {
  state: Pick<RootStoreType['counter']['state'], 'count'>
  reducers: RootStoreType['counter']['reducers']
  effects: RootStoreType['counter']['effects']
}

class Count extends React.Component<Props> {
  handleIncrease = () => {
    const { reducers } = this.props
    reducers.increase()
  }

  handleDecrease = () => {
    const { reducers } = this.props
    reducers.decrease()
  }

  render() {
    const { state, effects } = this.props

    if (effects.increaseAsync.loading) {
      return <p className="loading">loading ...</p>
    }

    return (
      <div className="counter">
        <p>The count is: {state.count}</p>
        <button onClick={this.handleIncrease}>+</button>
        <button onClick={this.handleDecrease}>-</button>
      </div>
    )
  }
}

export default withModel('counter', state => {
  // 只有当数据源 `counter` 中的 `state.count` 改变时才会触发当前组件的 re-render
  return {
    count: state.count,
  }
})(Count)
```
