# 最佳实践

对于 `React` 这种组件化的开发方式，一个页面通常会抽象为多个组件，每个组件可能会维护多个内部状态用于控制组件的表现行为。推荐将组件的状态、修改状态的行为以及副作用，即一个组件对应的 [模型]() 抽离到一个单独文件中通过 `Dobux` 接管，这样做有以下几方面优势：

1. 组件的模型可以集中式的统一管理，逻辑清晰，便于维护和扩展
2. `reducer` 提供了响应式的编程方式，只需要简单在函数体内修改数据就可以生成不可变数据源，避免出现引用类型的问题，保证依赖的正确性
3. 副作用的处理通过 `effects` 统一管控，页面只负责 UI 渲染，同时每个 `effect` 上都会记录异步操作的加载状态，简化了视图层中的呈现逻辑
4. 提供了完整的 `TypeScript` 类型定义，在编辑器中能获得完整的类型检查和类型推断
5. 内置了实用的 `reducer` 大大简化状态修改逻辑，提高开发效率

<Alert>对于 `Typescript` 的项目推荐使用下面两种方式对代码结构进行组织，这样会避免类型 [循环引用报错的问题](/guide/faq#实例化-store-时为什么要对-model-进行循环引用？)</Alert>

## 单一 Model

对于简单的业务场景，如单个组件或者一个简单的表单页，通常不需要状态共享，可以采用单一 `Model` 来对视图的状态进行管理。有两种文件组织形式

### 组件 + model.ts

创建一个 `model.ts` 文件创建组件对应的模型，在组件内引入并通过该 `model` 创建 `Store`，文件组织结构如下：

```
- counter
  - index.less
  - index.tsx
  - model.ts
```

<code src="../demos/counter/hooks/index.tsx"  />

### 组件 + store.ts + model.ts

创建一个 `model.ts` 文件创建组件对应的模型同时创建一个 `Store` 文件引入该 `model` 并创建 `Store`，在组件内引入 `Store` 进行消费。文件组织结构如下：

```
- counter
  - index.less
  - index.tsx
  - model.ts
  - store.ts
```

<code src="../demos/counter/hooks2/index.tsx"  />

## 多 Model

对于复杂的业务场景可以使用多 `Model` 模式，按照组件的颗粒度进行 `Model` 的拆分，在一个 `Store` 中处统一注入，多个 `Model` 之间可以通过 `effects` 的第二个参数 `rootModel` 相互调用，通过分层的设计降低单一 `Model` 的复杂度，提升项目的维护性和扩展性

文件组织结构如下：

```
- todo-list
  - Header
    - index.tsx
    - model.ts
  - UndoList
    - index.tsx
    - model.ts
  - index.less
  - index.tsx
  - models.ts
  - store.ts
```

<code src="../demos/todo-list/index.tsx"  />
