# Lifecycle

## useDidMount

模拟 Class Component 的 `componentDidMount` 生命周期钩子，只在组件 `mount` 时执行的 hook

### 代码演示

#### 基本用法

```tsx
import { useDidMount } from 'Dox'

function App() {
  useDidMount(() => {
    effects.fetch()
  })
}
```

### API

```ts
useDidMount(fn: EffectCallback): void
```

### Params

| 参数 | 说明                      | 类型           |
| ---- | ------------------------- | -------------- |
| fn   | 组件 `mount` 时执行的函数 | EffectCallback |

## useDidUpdate

模拟 Class Component 的 `componentDidUpdate` 生命周期钩子，只在依赖更新时执行的 hook

### 代码演示

#### 基本用法

```tsx
import { useState, useDidUpdate } from 'Dox'

function App() {
  const [count, setCount] = useState

  useDidUpdate(() => {
    // do something
  }, [count])
}
```

### API

```ts
useDidUpdate(fn: EffectCallback, deps?: React.DependencyList): void
```

### Params

| 参数  | 说明                 | 类型                 | 默认值 |
| ----- | -------------------- | -------------------- | ------ |
| fn    | 依赖更新时执行的函数 | React.EffectCallback |        |
| deps? | 依赖更新时执行的函数 | React.DependencyList |        |

## useUnmount

模拟 Class Component 的 `componentWillUnmount` 生命周期钩子，只在组件 `unmount` 时执行的 hook

### 代码演示

#### 基本用法

```tsx
import { useRef } from 'react'
import { useUnmount } from 'Dox'

function App(fn) {
  const fn = useRef(fn)

  useUnmount(() => {
    fn.current = null
  })
}
```

### API

```ts
useUnmount(fn: () => void): void
```

### Params

| 参数 | 说明                        | 类型       |
| ---- | --------------------------- | ---------- |
| fn   | 组件 `unmount` 时执行的函数 | () => void |

## useForceUpdate

模拟 Class Component 的 `this.forceUpdate` 方法，强制对组件进行刷新

### 代码演示

#### 基本用法

```tsx
import { useForceUpdate } from 'Dox'

function App() {
  const forceUpdate = useForceUpdate()

  return (
    <div>
      <div>Time: {Date.now()}</div>
      <button type="button" onClick={update}>
        update
      </button>
    </div>
  )
}
```

### API

```ts
useForceUpdate(): () => void
```

### Result

| 参数     | 说明                   | 类型       |
| -------- | ---------------------- | ---------- |
| dispatch | 调用该函数强制刷新组件 | () => void |
