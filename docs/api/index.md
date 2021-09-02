---
# https://d.umijs.org/zh-CN/config/frontmatter
order: 1
nav:
  order: 2
  title: API
toc: menu
---

# API

## `createModel<RootModel, 'modelName'>()(model)`

创建一个 `Dobux` 模型，它是一个 **高阶函数**，调用时没有入参，存在两个范型参数：

- `type RootModel`：整个 `store` 的根模型，通过 `dobux` 提供的 `Models<models>` 类型推导出，[示例代码](https://github.com/kcfe/dobux/blob/master/docs/demos/counter/hooks/index.tsx#L7)
- `type modelName: string`：当前模型的名称，是一个 `store` 下会包含多个 `Model` 之一，通常传入当前定义的 `Model`，[示例代码](https://github.com/kcfe/dobux/blob/master/docs/demos/counter/hooks/model.ts#L10)

执行之后返回一个函数，调用这个函数会创建一个模型，入参为 `model`，包含以下三个属性：

### `model.state: any`

当前模型的初始状态，通常为一个 JavaScript 对象，必传

```tsx | pure
import { createModel } from 'dobux'
import { RootModel } from 'path/to/type'

const counter = createModel<RootModel, 'counter'>()({
  state: {
    count: 0,
  },
})
```

### `model.reducers?: { [reducerName: string]: (state, ...payload: any[]) => void }`

修改模型状态的同步方法，非必传。当用户执行该函数时会默认传入以下参数：

- `state`：当前模型最新的状态，直接修改会生成一个新的对象并触发对应的组件更新
- `payload`：调用该 `reducer` 时传入的参数，支持传入多个

```ts
import { createModel } from 'dobux'
import { RootModel } from 'path/to/type'

const counter = createModel<RootModel, 'counter'>()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state, payload: number) {
      state.count += 1
    },
    decrease(state, a: number, b?: number) {
      state.count -= 1
    },
  },
})
```

`Dobux` 提供了三个内置的 `reducer`，可以很方便的进行状态更新，比如更新（重置）表单的字段

`reducers.setValue(key: K extends keyof State, value: State[K] | ((prevState: S[K]) => S[K]))`

更新指定的状态

- `key`：需要更新的字段名称，属于 `Object.keys(state)` 其中的一个，必传
- `value`：修改后的字面量或一个更新函数（类似调用 React.setState 时传入的回调函数），必传

```ts
// 字面量形式
reducers.setValue('count', 1)
// 回调函数形式
reducers.setValue('count', prevState => {
  return prevState - 1
})

// 字面量形式
reducers.setValue('userInfo', {
  name: 'dobux',
  age: 0,
})
// 回调函数形式
reducers.setValue('userInfo', prevState => {
  return {
    ...prevState,
    age: 1,
  }
})
```

> 注：如果需要拿到 **最新状态** 需要使用回调函数的形式

`reducers.setValues(state: Partial<State> | ((prevState: S) => S))`

批量状态更新

- `state`：修改后的字面量或一个更新函数（类似调用 React.setState 时传入的回调函数），必传

```ts
// 字面量形式
reducers.setValues({
  count: 1,
})
// 回调函数形式
reducers.setValues(prevState => {
  return {
    count: 1,
  }
})

// 字面量形式
reducers.setValues({
  count: 5,
  userInfo: {
    name: 'dobux',
    age: 1,
  },
})
// 回调函数形式
reducers.setValues(prevState => {
  return {
    count: 1,
    userInfo: {
      ...prevState.userInfo,
      name: 'dobux',
    },
  }
})
```

> 注：框架内部只会批量更新第一层数据，如果需要更新深层的数据，需要手动合并

`reducers.reset(key?: K extends keyof State)`

重置状态为初始值

- `key`：如果没有传入则重置整个 `state`，如果传入则重置指定的字段，非必传

```ts
// reset total state
reducers.reset()

// reset specific state
reducers.reset('count')
```

### `model.effects?: (model: Model, rootModel: RootModel) => { [effectName: string]: (...payload: any) => Promise<any> }`

所有的副作用函数都需要在 `effects` 中处理，非必传，当用户执行该函数时会默认传入以下参数：

- `model`：当前模型实例
  - `model.state`：当前模型的状态
  - `model.reducers`：当前组件可用于修改模型状态的方法
  - `model.effects`：当前组件可用于执行副作用的方法
- `rootModel`：整个 `store` 的根模型实例，保存了同一个 `store` 下所有的 `model`，可以通过这个对象操作其他的模型，[查看示例](/guide/examples#待办事项清单)
  - `{ [modelName: string]: Model }`
- `payload`：调用该 `effect` 时传入的参数，支持传入多个

```ts
import { createModel } from 'dobux'
import { RootModel } from 'path/to/type'

const counter = createModel<RootModel, 'counter'>()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state) {
      state.count += 1
    },
  },
  effects: (model, rootModel) => ({
    async increaseAsync(payload: number) {
      await wait(1000)
      model.reducers.increase()
    },
  }),
})
```

## `store = createStore(models, options)`

用于创建一个 `Dobux` 的 `Store` 实例

- `models`: 通过 [createModel](#createmodelrootmodel-modelnamemodel) 创建的多个 `model` 组成的一个对象，其中对象的 `key` 值为模型的名称，在组件内调用 `useModel(key)` 消费数据时传入

- `options.name?: string`：指定 `store` 的名称，该名称会显示在 [redux devtools](/guide/devtools) 的面板上，非必传，默认为 `dobux/${number}`

- `options.autoReset?: boolean | Array<keyof models>`：组件内部通过 `useModel` 消费数据源时，在组件卸载的时候是否需要自动重置为初始的数据，非必传，默认为 `false`，如果传入 `true` 表示当前 `store` 对应的多个 `model` 在组件卸载的时候都会自动卸载数据；如果传入数组可以指定某些 `model` 执行卸载操作

- `options.devtools?: boolean | Array<keyof models>`：在开发环境下模型是否支持连接 `redux devtools`，非必传，默认为 `true`，如果传入 `false` 表示当前 `store` 下的所有 `model` 都不支持连接 `devtools`，传入数组可以指定某些 `model` 不连接 `devtool`

#### 基本使用

```ts
import { createModel, createStore } from 'dobux'

const counter = createModel()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state, payload: number) {
      state.count += 1
    },
    decrease(state, payload: number) {
      state.count -= 1
    },
  },
  effects: (model, rootModel) => ({
    async increaseAsync(payload: number) {
      await wait(1000)
      model.reducers.increase()
    },
  }),
})

const store = createStore({
  counter,
})
```

#### 自动重置

```ts
import { createModel, createStore } from 'dobux'

const counter = createModel()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state, payload: number) {
      state.count += 1
    },
    decrease(state, payload: number) {
      state.count -= 1
    },
  },
  effects: (model, rootModel) => ({
    async increaseAsync(payload: number) {
      await wait(1000)
      model.reducers.increase()
    },
  }),
})

const store = createStore(
  {
    counter,
  },
  {
    // 当前 Store 下的所有 Model 都会自动卸载
    autoReset: true,
  }
)

const store = createStore(
  {
    counter,
  },
  {
    // 当前 Store 下的 `counter` Model 会自动卸载
    autoReset: ['counter'],
  }
)
```

#### Devtools

```ts
import { createModel, createStore } from 'dobux'

const counter = createModel()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state, payload: number) {
      state.count += 1
    },
    decrease(state, payload: number) {
      state.count -= 1
    },
  },
  effects: (model, rootModel) => ({
    async increaseAsync(payload: number) {
      await wait(1000)
      model.reducers.increase()
    },
  }),
})

const store = createStore(
  {
    counter,
  },
  {
    // 关闭当前 Store 下的所有 Model 的 Devtool 功能
    devtools: false,
  }
)

const store = createStore(
  {
    counter,
  },
  {
    // 当前 Store 下的 `counter` Model 开启 Devtool 功能，其他 Model 关闭
    devtools: ['counter'],
  }
)
```

### `store.Provider: (props: { children: React.ReactElement }) => React.ReactElement`

通过 `Provider` 将 `Store` 实例挂载到 `React` 应用，以便组件能够通过 `Hooks` 的方式获取不同的模型进行交互

- `props.children`：需要消费 `store` 的子节点

```tsx | pure
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import store from './store'

const { Provider } = store

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

### `store.withProvider: (component: React.FunctionComponent) => React.ReactElement`

作用同 `Provider`，区别是该组件是一个 **高阶组件**，在组件内通过 `useModel` 获取指定的模型必须要在 `Provider | withProvider` 的子组件中执行，对于不希望嵌套一层组件的需求就可以使用 `withProvider` 包裹

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

### `store.withProviderForwardRef: <T, P = Record<string, unknown>>(Component: React.ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>) => React.ReactElement`

该 API 与 `withProvider` 的区别在于 `withProvider` 不能增强使用 `React.forwardRef` 包裹的组件，该 API 可以解决这个问题

```tsx | pure
import React, { useImperativeHandle } from 'react'
import store from './store'

const { withProviderForwardRef } = store

const WithProviderForwardRefDemo = React.forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      say() {
        console.log('Hello Dobux')
      },
    }
  })

  return <></>
})

export default withProviderForwardRef(WithProviderForwardRefDemo)
```

### `store.useModel: (modelName: string, mapStateToModel?: (state: State) => any) => { state, reducers, effects }`

通过该 API 可以在函数组件内获取对应模型的实例，接受两个参数：

- `modelName`：需要消费的模型名称，即执行 `createStore(models)` 时传入对象的 `key` 值 `keyof models`，必传
- `mapStateToModel`：返回一个自定义的对象作为组件真实的消费模型 `state`，表示当前组件只有在这个返回对象发生改变时才会重新触发组件的渲染，用于性能优化，阻止不必要的渲染，入参为当前模型最新的 `state`，非必传

返回结果的信息如下：

- `state`：当前消费模型对应的最新状态
- `reducers`：当前组件可用于修改模型状态的方法
- `effects`：当前组件可用于执行副作用的方法；其中 `effects.effectName.loading` 记录了异步操作时的状态，当执行 `effects.effectName` 时会将 `effects.effectName.loading` 设置为 `true`，当对应的副作用执行完成后会将 `effects.effectName.loading` 重置为 `false`。在视图中不再需要自己定义多个 `loading` 状态，通过该属性就简化视图层逻辑

#### 基本用法

```tsx | pure
import React from 'react'
import store from './store'

const Counter: React.FC = () => {
  const { state, reducers, effects } = store.useModel('counter')

  // 当异步请求 `increaseAsync` 执行时 `loading` 会设置为 true，显示 loading
  if (effects.increaseAsync.loading) {
    return <div>loading ...</div>
  }

  return <div>Count: {state.count}</div>
}
```

#### 性能优化

在某些组件中可能只需要依赖某一数据源的部分状态，同时只有当这部分依赖的状态变化时才会重新渲染，可以通过 `useModel` 第二个参数的 `mapStateToModel` 属性进行控制

```tsx | pure
import React, { FC } from 'react'
import store from './store'

const Counter: FC = () => {
  const { state, reducers, effects } = store.useModel('counter', state => {
      // 只有当模型 `counter` 中的 `count` 字段改变时才会触发当前组件的 rerender
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

### `store.withModel: (modelName: string, mapStateToModel?: (state: State) => any, contextName?: string) => (Component: React.ComponentType) => React.ComponentType`

对于 Class Component 可以通过 `withModel` 高阶组件进行模型的消费，该组件接受两个参数：

- `modelName`：需要消费的模型名称，即执行 `createStore(models)` 时传入对象的 `key` 值 `keyof models`，必传
- `mapStateToModel`：返回一个自定义的对象作为组件真实的消费模型 `state`，表示当前组件只有在这个返回对象发生改变时才会重新触发组件的渲染，用于性能优化，阻止不必要的渲染，入参为当前模型最新的 `state`，非必传
- `contextName`：在被包裹组件的 `props` 上挂载的属性名，默认为空，会在被包裹组件的 `props` 上挂载以下三个属性：
  - `props.state`：当前消费的模型对应的最新状态
  - `props.reducers`：当前组件可用于修改模型状态的方法
  - `props.effects`：当前组件可用于执行副作用的方法，其中 `effects.effectName.loading` 记录了异步操作时的状态，可以简化视图层逻辑

如果传入了 `contextName` 则对应 `model` 的状态和方法都会在被包裹组件的 `props[contextName][modelName]` 上暴露：

- `props[contextName].state`：当前消费的模型对应的最新状态
- `props[contextName].reducers`：当前组件可用于修改模型状态的方法
- `props[contextName].effects`：当前组件可用于执行模型副作用的方法

> 当使用的组件与已有 props 冲突时，则默认不引入 model 中对应的值。比如组件外层传递了 state 属性，那么 dobux 的 state 就不会传入

#### 基本用法

```tsx | pure
import store, { RootModel } from './store'

const { withModel } = store

export interface CounterProps {
  state: RootModel['counter']['state']
  reducers: RootModel['counter']['reducers']
  effects: RootModel['counter']['effects']
}

class Counter extends React.Component<CounterProps> {
  handleIncrease = () => {
    const { reducers } = this.props
    reducers.increase()
  }

  handleDecrease = () => {
    const { reducers } = this.props
    reducers.decrease()
  }

  handleIncreaseAsync = () => {
    const { effects } = this.props
    effects.increaseAsync()
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
        <button onClick={this.handleIncreaseAsync}>async</button>
      </div>
    )
  }
}

export default withModel('counter')(Counter)
```

#### 性能优化

在某些组件中可能只需要依赖某一数据源的部分状态，同时只有当这部分依赖的状态变化时才会重新渲染，可以通过 `withModel` 第二个参数的 `mapStateToModel` 属性进行控制

```tsx | pure
import store, { RootModel } from './store'

const { withModel } = store

export interface CounterProps {
  state: Pick<RootModel['counter']['state'], 'count'>
  reducers: RootModel['counter']['reducers']
  effects: RootModel['counter']['effects']
}

class Counter extends React.Component<CounterProps> {
  handleIncrease = () => {
    const { reducers } = this.props
    reducers.increase()
  }

  handleDecrease = () => {
    const { reducers } = this.props
    reducers.decrease()
  }

  handleIncreaseAsync = () => {
    const { effects } = this.props
    effects.increaseAsync()
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
        <button onClick={this.handleIncreaseAsync}>async</button>
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

### `store.withModels: (modelNames: string[], mapStateToModels?: { [modelName: string]: (state: State) => any) }, contextName = 'models') => (Component: React.ComponentType) => React.ComponentType`

`withModel` 只支持传入一个 model，而 `withModels` 支持传入多个 models 供 Class Component 消费，该组件接受三个参数：

- `modelNames`：需要消费的模型名称列表，即执行 `createStore(models)` 时传入对象的 `key` 值 `keyof models`，必传
- `mapStateToModels`：返回一个自定义的对象作为组件真实的消费模型 `state`，表示当前组件只有在这个返回对象发生改变时才会重新触发组件的渲染，用于性能优化，阻止不必要的渲染，入参为当前模型最新的 `state`，非必传
- `contextName`：在被包裹组件的`props`上挂载的属性名，默认为 `models`，**当使用的 `contextName` 和组件已有 props 冲突时，默认不引入 model，保留原有 `contextName` 的值**

每个 model 的状态和方法都会在被包裹组件的 `props[contextName][modelName]` 上暴露：

- `props[contextName].modelA.state`：当前消费的模型`modelA`对应的最新状态
- `props[contextName].modelA.reducers`：当前组件可用于修改模型`modelA`状态的方法
- `props[contextName].modelA.effects`：当前组件可用于执行模型`modelA`副作用的方法，其中 `effects.effectName.loading` 记录了异步操作时的状态，可以简化视图层逻辑

#### 基本用法

```tsx | pure
import store, { RootModel } from './store'

const { withModels } = store

export interface CounterProps {
  forDobux: {
    [k: keyof RootModel]: {
      state: RootModel[k]['state']
      reducers: RootModel[k]['reducers']
      effects: RootModel[k]['effects']
    }
  }
}

class Counter extends React.Component<CounterProps> {
  handleIncrease = (modelName: string) => () => {
    this.props.forDobux[modelName].reducers.increase()
  }

  handleDecrease = (modelName: string) => () => {
    this.props.forDobux[modelName].reducers.decrease()
  }

  handleIncreaseAsync = (modelName: string) => () => {
    this.props.forDobux[modelName].effects.increaseAsync()
  }

  render() {
    const {
      forDobux: {
        counter1: { state: state1, effects: effects1 },
        counter2: { state: state2, effects: effects2 },
      },
    } = this.props

    if (effects1.increaseAsync.loading || effects2.increaseAsync.loading) {
      return <p className="loading">loading ...</p>
    }

    return (
      <>
        <div className="counter1">
          <p>The count1 is: {state1.count}</p>
          <button onClick={this.handleIncrease('counter1')}>+</button>
          <button onClick={this.handleDecrease('counter1')}>-</button>
          <button onClick={this.handleIncreaseAsync('counter1')}>async</button>
        </div>
        <div className="counter2">
          <p>The count2 is: {state2.count}</p>
          <button onClick={this.handleIncrease('counter2')}>+</button>
          <button onClick={this.handleDecrease('counter2')}>-</button>
          <button onClick={this.handleIncreaseAsync('counter2')}>async</button>
        </div>
      </>
    )
  }
}

export default withModels(['counter1', 'counter2'], undefined, 'forDobux')(Counter)
```

#### 性能优化

在某些组件中可能只需要依赖某一数据源的部分状态，同时只有当这部分依赖的状态变化时才会重新渲染，可以通过 `withModels` 第二个参数的 `mapStateToModel` 属性进行控制

```tsx | pure
import store, { RootModel } from './store'

const { withModels } = store

export interface CounterProps {
  models: {
    [k: keyof RootModel]: {
      state: RootModel[k]['state']
      reducers: RootModel[k]['reducers']
      effects: RootModel[k]['effects']
    }
  }
}

class Counter extends React.Component<CounterProps> {
  handleIncrease = (modelName: string) => () => {
    this.props.models[modelName].reducers.increase()
  }

  handleDecrease = (modelName: string) => () => {
    this.props.models[modelName].reducers.decrease()
  }

  handleIncreaseAsync = (modelName: string) => () => {
    this.props.models[modelName].effects.increaseAsync()
  }

  render() {
    const {
      models: {
        counter1: { state: state1, effects: effects1 },
        counter2: { state: state2, effects: effects2 },
      },
    } = this.props

    if (effects1.increaseAsync.loading || effects2.increaseAsync.loading) {
      return <p className="loading">loading ...</p>
    }

    return (
      <>
        <div className="counter1">
          <p>The count1 is: {state1.count}</p>
          <button onClick={this.handleIncrease('counter1')}>+</button>
          <button onClick={this.handleDecrease('counter1')}>-</button>
          <button onClick={this.handleIncreaseAsync('counter1')}>async</button>
        </div>
        <div className="counter2">
          <p>The count2 is: {state2.count}</p>
          <button onClick={this.handleIncrease('counter2')}>+</button>
          <button onClick={this.handleDecrease('counter2')}>-</button>
          <button onClick={this.handleIncreaseAsync('counter2')}>async</button>
        </div>
      </>
    )
  }
}

export default withModels(['counter1', 'counter2'], {
  counter1: state => {
    // 只有当数据源 `counter1` 中的 `state.count` 改变时才会触发当前组件的 re-render
    return {
      count: state.count,
    }
  },
  counter2: state => {
    return {
      count: state.count,
    }
  },
})(Count)
```

### `store.getState: (modelName?: string) => ModelState`

获取指定（所有）模型的最新状态 `state`，可以在组件外部使用。可以解决在闭包中获取最新的状态值或者想要只使用状态而不订阅更新的场景

- `modelName`：模型名称，非必传，如果传入会返回对应模型的 `state`，如果没传入会返回整个 `store` 对应的多个模型的 `state`

```tsx | pure
import { store } from './store'

const rootState = store.getState()
// { header: { value: ''}, undoList: { items: [{ content: 'Learn dobux' }] } }

const headerState = store.getState('header')
// { value: ''}

const undoListState = store.getState('undoList')
// { items: [{ content: 'Learn dobux' }] }
```

### `store.getReducers: (modelName?: string) => ModelReducers`

获取指定（所有）模型的 `reducers`，可以在组件外部使用。可以解决在闭包中获取指定的 `reducers` 或者想要只使用 `reducers` 而不订阅更新的场景

- `modelName`：模型名称，非必传，如果传入会返回对应模型的 `reducers`，如果没传入会返回整个 `store` 对应的多个模型的 `reducers`

```tsx | pure
import { store } from './store'

const rootReducers = store.getReducers()
// { header: { changeValue, setValue, setValues, reset }, undoList: { addItem, deleteItem, toggleItem, setValue, setValues, reset } }

const headerReducers = store.getReducers('header')
// { changeValue, setValue, setValues, reset }

const undoListReducers = store.getReducers('undoList')
// { addItem, deleteItem, toggleItem, setValue, setValues, reset }
```

### `store.getEffects: (modelName?: string) => ModelEffects`

获取指定（所有）模型的 `effects`，可以在组件外部使用。可以解决在闭包中获取指定的 `effects` 或者想要只使用 `effects` 而不订阅更新的场景

- `modelName`：模型名称，非必传，如果传入会返回对应模型的 `effects`，如果没传入会返回整个 `store` 对应的多个模型的 `effects`

```tsx | pure
import { store } from './store'

const rootEffects = store.getEffects()
// { header: { addUndoItem }, undoList: { fetchUndoList } }

const headerEffects = store.getEffects('header')
// { addUndoItem }

const undoListEffects = store.getEffects('undoList')
// { fetchUndoList } 
```
