# DevTools

`Dobux` 在 **开发环境** 默认集成了 [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)，可以借助浏览器插件实现 **time travel** 功能，其中每一个状态改变的 `action` 名称由 `modelName/reducerName` 标识

![](/time-travel.gif)

## 多 Model travel

`Dobux` 支持使用多 Model 注入，对于这种情况每个 Model 都会和 redux-devtools 建立一个独立的连接生成一个 devtools 的实例，对应的实例名称为 `@dobux/modelName`，通过 devtools 的实例的切换面板可以根据诉求查看对应的 Model 的状态改变

> 注：为了减少过多的占用 Chrome 内存，当前 Model 对应的组件卸载的时候会断开与 devtools 的连接，切换到新的 Model 后可能需要手动重新开启（先关闭再开启）开发者调试工具

![](/multiple-model.gif)
