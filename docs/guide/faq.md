# FAQ

### 实例化 Store 时为什么要对 Model 进行循环引用？

由于 `typescript` 的类型推断是建立在静态检查的前提下，是需要根据用户定义的字面量推断出它的结构，在使用 `createModel` 创建模型的时候，模型内部的 `reducers` 会依赖 `state`，`effects` 会依赖 `model` 和 `rootModel`，内部本身就存在一个循环引用。由于文件之间 `import` 的是静态类型而不是实际的代码，因此不会影响代码本身的执行逻辑，只是通过这种方式帮助推断出类型。如果项目不使用 `typescript` 或者不需要推断出上述的类型，可以避免使用这种类型循环引用

### 一个 Effect 中返回另一个 Effect 的执行函数类型推断失效

```ts
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
      await wait(1000)
      model.reducers.increase()
      // 出现循环引用，类型推断错误
      return model.effects.decreaseAsync()
    },

    async decreaseAsync() {
      await wait(1000)
      return -1
    },
  }),
})
```

这是因为类型推断出现了 **循环引用** 的情况，解决方案是 **手动指定 effect 返回类型，打破循环依赖**

```diff
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
      await wait(1000)
      model.reducers.increase()
+      // 手动指定 effect 返回类型，打破循环依赖
+      const result: number = await model.effects.decreaseAsync()
+      return result
-      return model.effects.decreaseAsync()
    },

    async decreaseAsync() {
      await wait(1000)
      return -1
    },
  }),
})
```

### 路由之间切换时 Model 的状态会一直保存，但是业务需要自动卸载？

使用 `Dobux` 创建的 `store` 实例会常驻于浏览器的中内存，默认情况下当组件卸载是不会自动重置的，如果想要在组件卸载的时候重置数据可以根据实际需求在组件卸载的时候调用 `reducers.reset` 方法重置

```tsx | pure
import React, { FC, useEffect } from 'react'
import store from './store'

const Counter: FC = () => {
  const {
    state,
    reducers: { reset },
    effects,
  } = store.useModel('counter')

  useEffect(() => {
    return () => reset()
  }, [])

  if (effects.increaseAsync.loading) {
    return <div>loading ...</div>
  }

  return <div>Count: {state.count}</div>
}
```

### 多 Model 模式下，一个 Model 的改变会影响依赖其他 Model 的组件刷新，引起不必要的渲染吗？

不会，一个 `Model` 的状态改变时，只有依赖了这个 `Model` 的组件会发生重新渲染，其他组件是无感知的。同时 `useModel` 同样提供了第二个参数 `mapStateToModel` 进行性能优化，你可以通过该函数的返回值精确的控制组件的渲染力度，[详见](/api#性能优化)

### 通过 `useModel` 获取的 `state` 是在一个 Hooks 的闭包中，如何在 `useCallback` 等闭包中获取最新的值？

`Dobux` 提供了 `getState` API，提供了获取模型最新状态的能力，[详见](/api#storegetstate-modelname-string--modelstate)
