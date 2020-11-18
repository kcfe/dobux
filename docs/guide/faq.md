# FAQ

### 实例化 Store 时为什么要对 Model 进行循环引用？

由于 `typescript` 的类型推断是建立在静态检查的前提下，是需要根据你的定义才能推断出它的结构，在定义 model 的时候无法推断出自己，因此需要进行一次 **类型的循环引用**，这不会影响代码本身的执行逻辑，只是帮助你推断出类型。如果你不使用 `typescript` 或者不需要推断出 `effects` 中使用的 `store` 以及 `Models`，可以避免使用这种类型循环引用

### 路由之间切换时 Model 的状态会一直保存，但是业务需要自动卸载

使用 `@dobux/store` 创建的 store 实例会常驻于内存，默认情况下当组件卸载是不会自动重置的，如果想要在组件卸载的时候重置数据可以通过 `Provider` 或者 `withProvider` 的选项进行控制，[详见](/api/return.html#provider)

### 多 Model 模式下，一个 Model 的改变会影响依赖其他 Model 的组件刷新，引起不必要的渲染吗？

不会，一个 Model 的状态 state 改变时，只有依赖了这个 Model 的组件会执行 rerender，其他组件是无感知的，同时 `useModel` 同样提供了第二个参数 `mapStateToProps` 进行性能优化，你可以通过该参数精确的控制组件的渲染力度，[详见](/api/#store-usemodel)
