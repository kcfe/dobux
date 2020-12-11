# FAQ

### 实例化 Store 时为什么要对 Model 进行循环引用？

由于 `typescript` 的类型推断是建立在静态检查的前提下，是需要根据用户定义的字面量推断出它的结构，在使用 `createModel` 创建模型的时候，模型内部的 `reducers` 会依赖 `state`，`effects` 会依赖 `model` 和 `rootModel`，内部本身就存在一个循环引用。由于文件之间 `import` 的是静态类型而不是实际的代码，因此不会影响代码本身的执行逻辑，只是通过这种方式帮助推断出类型。如果项目不使用 `typescript` 或者不需要推断出上述的类型，可以避免使用这种类型循环引用

### 路由之间切换时 Model 的状态会一直保存，但是业务需要自动卸载？

使用 `Dobux` 创建的 `store` 实例会常驻于浏览器的中内存，默认情况下当组件卸载是不会自动重置的，如果想要在组件卸载的时候重置数据可以通过 `createStore` 的第二个参数控制，[详见](/api/return.html#provider)

### 多 Model 模式下，一个 Model 的改变会影响依赖其他 Model 的组件刷新，引起不必要的渲染吗？

不会，一个 `Model` 的状态改变时，只有依赖了这个 `Model` 的组件会发生重新渲染，其他组件是无感知的。同时 `useModel` 同样提供了第二个参数 `mapStateToProps` 进行性能优化，你可以通过该函数的返回值精确的控制组件的渲染力度，[详见](/api/return.html#usestore)
