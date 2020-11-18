# Utility

## useId

获取全局的 Id，在组件更新过程中保持不变。

### 代码演示

#### 基本用法

```tsx
import { useId } from 'Dox'

function App() {
  const id = useId()

  return (
    <div>
      <label htmlFor={id}>name:</label>
      <ChildComponent key={id} />
    </div>
  )
}
```

#### 基于 Props 传递

有则直接返回，否则重新生成。

```tsx
import { useId } from 'Dox'

function Child({ id }) {
  const uniqueId = useId({
    provided: id,
  })

  return (
    <div>
      <label htmlFor={uniqueId}>name:</label>
      <input id={uniqueId} />
    </div>
  )
}
```

### API

```ts
export interface UseIdOptions {
  prefix?: string
  providedId?: string
  length?: number
}

export function useId({ prefix, providedId, length = 10 }: UseIdOptions): string
```

### Params

| 参数               | 说明                                   | 类型   |
| ------------------ | -------------------------------------- | ------ |
| options.prefix     | 可选，返回的 id 字符串的前缀           | string |
| options.providedId | 可选，非空时直接返回该值，否则重新生成 | string |
| options.length     | 返回的字符串长度，默认 10              | number |

### Result

| 参数   | 说明             | 类型   |
| ------ | ---------------- | ------ |
| result | 生成的唯一字符串 | string |

## usePersistFn

对传入的 `Function` 进行持久化

在 `hooks` 的开发过程中，每个 `hook` 的执行都是在一个闭包中，如果在 `hook` 中定义了 Function，每次渲染之后都会创建一个新的引用对象，如果子组件将该函数作为了 `props` 接收，那么每次父组件每次渲染的时候都会对子组件造成不必要的 `rerender`，对于超级复杂的子组件，重新渲染会对性能造成影响。通过 `usePersistFn`，可以保证函数地址永远不会变化

### 代码演示

#### 基本用法

```tsx
import { usePersistFn } from 'Dox'

function App() {
  const persistFn = usePersistFn(() => {
    // do something
  })

  <ExpensiveComponent onChange={persistFn}>
}
```

### API

```ts
usePersistFn<T extends (...args: any[]) => any>(fn: T);
```

### Params

| 参数 | 说明             | 类型 | 默认值 |
| ---- | ---------------- | ---- | ------ |
| fn   | 需要持久化的函数 | T    | -      |

### Result

| 参数      | 说明           | 类型 |
| --------- | -------------- | ---- |
| persistFn | 持久化后的函数 | T    |

## usePersist

对传入的数据进行持久化

在 `hooks` 的开发过程中，每个 `hook` 的执行都是在一个闭包中，如果在 `hook` 中定义了一个引用对象，每次渲染之后都会创建一个新的引用对象，如果子组件依赖了该对象，那么每次父组件每次渲染的时候都会对子组件造成不必要的 `rerender`，对于超级复杂的子组件，重新渲染会对性能造成影响。通过 `usePersist`，可以保证传入的参数引用地址永远不会变化

### 代码演示

#### 基本用法

```tsx
import { usePersist } from 'Dox'

function App() {
  const persistValue = usePersist({
    name: 'Dox',
    version: '1.0.0'
  })

  <ExpensiveComponent onChange={persistValue}>
}
```

#### 传入函数计算出需要持久化的值

```tsx
import { usePersist } from 'Dox'

function App() {
  const persistValue = usePersist(() => {
    return {
      name: 'Dox',
      version: '1.0.0'
    }
  })

  <ExpensiveComponent onChange={persistValue}>
}
```

### API

```ts
usePersist<T>(initialValue: T | (() => T)): T
```

### Params

| 参数         | 说明                    | 类型           | 默认值 |
| ------------ | ----------------------- | -------------- | ------ |
| initialValue | 需要持久化的值/转化函数 | T \| (() => T) | -      |

### Result

| 参数         | 说明         | 类型 |
| ------------ | ------------ | ---- |
| persistValue | 持久化后的值 | T    |

## useEventCallback

对传入的函数进行持久化

在组件 `props` 的传递过程中为了保持函数引用的不变，你可能会需要用 `useCallback` 包裹这个函数，但由于内部函数必须经常重新创建，记忆效果不是很好，通过 `useEventCallback` 可以很好的解决这个问题，始终保持引用的不变，它与 `usePersistFn` 的区别是如果需要持久化的函数需要依赖当前函数作用域中的属性，可以将这些属性加入到依赖列表 `dependencies` 中，保持最新的引用

### 代码演示

#### 基本用法

```tsx
import { useEventCallback } from 'Dox'

function App() {
  const [text, updateText] = useState('')
  // 即便 text 变了也会被记住:
  const handleSubmit = useEventCallback(() => {
    alert(text)
  }, [text])

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  )
}
```

### API

```ts
useEventCallback<T extends (...args: any[]) => any>(fn: T, dependencies: any[]): T
```

### Params

| 参数         | 说明               | 类型                    | 默认值 |
| ------------ | ------------------ | ----------------------- | ------ |
| fn           | 需要被持久化的函数 | (...args: any[]) => any | -      |
| dependencies | 函数内依赖的变量   | any[]                   | -      |

### Result

| 参数      | 说明           | 类型                    |
| --------- | -------------- | ----------------------- |
| persistFn | 持久化后的函数 | (...args: any[]) => any |

## createLatestFetch

对请求函数处理，获取当前请求的最新一次结果。

> 注: 该函数可以在 `React.FC` 之外运行。

### 基本用法

适用于短时间内发送多个相同请求，且请求结果返回顺序不稳定的情况（eg：BI 系统中对于数据过滤的筛选项切换，确保显示最新的筛选结果数据）。

多次请求切换后，之前的请求结果会被丢弃，即 `Promise` 状态会是 `Pending`（不会取消之前的请求）。

```tsx
import { createLatestFetch } from 'Dox';
const latestFetch = createLatestFetch(originFetch);

function App() {
  const [state, setState] = useState();
  useEffect(() => {
    latestFetch(params).then(
      res => setState(res);
    );
  }, [params]);
}
```

### API

```ts
function createLatestFetch<T extends any[]>(
  fn: (...args: T) => Promise<any>
): (...args: T) => Promise<any>
```

### Params

| 参数     | 说明                    | 类型                           |
| -------- | ----------------------- | ------------------------------ |
| originFn | 返回 Promise 的请求函数 | (...args: T) => Promise\<any\> |

### Result

| 参数   | 说明                                       | 类型                           |
| ------ | ------------------------------------------ | ------------------------------ |
| result | 新的请求函数，多次调用会返回最近请求的结果 | (...args: T) => Promise\<any\> |

## useWhyDidYouUpdate

帮助开发者排查是什么改变导致了组件的 rerender

通过该 `hook` 可以轻松查看是哪些 `state` 或者 `props` 的更改导致了组件重新渲染。如果一个函数的运行成本特别高，并且你知道它在给定相同的 `props` 的情况下呈现相同的结果，则可以使用 `React.memo` 高阶组件，就像下面示例中对 `Counter` 组件所做的那样。在这种情况下，如果仍然看到似乎不必要的重新渲染，则可以使用 `useWhyDidYouUpdate` 并检查控制台以查看哪些道具在渲染之间发生了变化，并根据其先前/当前值进行性能优化

### 代码演示

#### 基本用法

```tsx
import { useState, useEffect, useRef } from 'react'
import { useWhyDidYouUpdate } from 'Dox'

const Counter = React.memo(props => {
  useWhyDidYouUpdate('Counter', props)
  return <div style={props.style}>{props.count}</div>
})

import { useState, useEffect, useRef } from 'react'
import { useWhyDidYouUpdate } from 'Dox'

const Counter = React.memo(props => {
  useWhyDidYouUpdate('Counter', props)
  return <div style={props.style}>{props.count}</div>
})

function App() {
  const [count, setCount] = useState(0)
  const [userId, setUserId] = useState(0)

  const counterStyle = {
    fontSize: '3rem',
    color: 'red',
  }

  return (
    <div>
      <div className="counter">
        <Counter count={count} style={counterStyle} />
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
      <div className="user">
        <img src={`http://i.pravatar.cc/80?img=${userId}`} />
        <button onClick={() => setUserId(userId + 1)}>Switch User</button>
      </div>
    </div>
  )
}
```

### API

```ts
useWhyDidYouUpdate(name: string, props: Record<string, any>): void
```

### Params

| 参数  | 说明                                                                                 | 类型   | 默认值 |
| ----- | ------------------------------------------------------------------------------------ | ------ | ------ |
| name  | 需要进行观测的组件名称                                                               | string | -      |
| props | 需要进行观测的数据（当前组件 `state` 或者传入的 `props` 等可能导致 rerender 的数据） | object | {}     |

### Result

打开控制台，可以看到改变的 被观测的 `state` 或者 `props` 等输出
