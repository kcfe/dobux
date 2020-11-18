---
sidebarDepth: 2
---

# 介绍

`Dox`：一个 React Hooks 库，致力于提供常用和高质量的的 Hooks

## 安装

- 使用 `yarn`

```bash
$ yarn add Dox
```

- 使用 `npm`

```bash
$ npm install Dox --save
```

## 基本使用

```tsx
import { useBoolean } from 'Dox'

function App() {
  const [state, toggle] = useBoolean()

  return (
    <div>
      <p>current state: {`${state}`}</p>
      <p>
        <button type="button" onClick={() => toggle(true)}>
          Set True
        </button>
        <button type="button" onClick={() => toggle(false)}>
          Set False
        </button>
      </p>
    </div>
  )
}
```
