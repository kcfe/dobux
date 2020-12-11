# Devtools

`Dobux` 在 **开发环境** 默认集成了 [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)，可以借助浏览器插件实现 **time travel** 功能。每个通过 [createModel](/api#createmodelrootmodel-modelnamemodel) 生成的 `Model` 都会和 `redux-devtools` 建立一个独立的连接生成一个 `devtools` 实例，对应的实例名称默认为 `dobux/number/modelName`，例如 `dobux/1/counter`，其中 `dobux/1` 为默认生成的 `storeName`（可以通过 [createStore](/api#store--createstoremodels) 创建 `store` 的时候传入自定义的名称），`counter` 为 `modelName`。每一个状态改变的 `action` 名称由 `modelName/reducerName` 组成，例如 `counter/increase`

<div style="text-align: center">
  <img width="1000px" src="/time-travel-counter.gif" />
</div>

## 多 Model travel

`Dobux` 支持使用多 Model 注入。通过 devtools 的实例的切换面板可以根据诉求查看对应的 Model 的状态改变

<div style="text-align: center">
  <img width="1000px" src="/time-travel-todo-list.gif" />
</div>

> 注：为了减少过多的占用 Chrome 内存，当前 Model 对应的组件卸载的时候会断开与 devtools 的连接，切换到新的 Model 后可能需要手动重新开启（先关闭再开启）开发者调试工具
