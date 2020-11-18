# Redux

## 简单计数器实现

```tsx
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';

// 1. Actions
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

function increase() {
  return {
    type: INCREASE
  };
}

function decrease() {
  return {
    type: DECREASE
  };
}

function increaseAsync() {
  return async (dispatch: any) => {
    await delay(2000);
    dispatch({ type: INCREASE });
  };
}

// 2. Reducers
function counter(state = { count: 0 }, action: any) {
  switch (action.type) {
    case INCREASE:
      return {
        count: state.count + 1
      };
    case DECREASE:
      return {
        count: state.count - 1
      };
    default:
      return state;
  }
}

// 3. Store
const store = createStore(counter, applyMiddleware(thunk));

// 4. View
const Counter = connect<any, any>(state => state)((props: any) => {
  return (
    <div>
      <h2>{props.count}</h2>
      <button
        key="increase"
        onClick={() => {
          props.dispatch(increase());
        }}
      >
        +
      </button>
      <button
        key="decrease"
        onClick={() => {
          props.dispatch(decrease());
        }}
      >
        -
      </button>
      <button
        key="increaseAsync"
        onClick={() => {
          props.dispatch(increaseAsync());
        }}
      >
        async
      </button>
    </div>
  );
});

// 5. Provider
const App = () => {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
};

export default App;
```

## 数据源

`redux` 提供单一 `Store` 的注入形式，随着业务的复杂性势必会导致单一数据源的复杂性

## Reducer

`redux` 的 `Reducer` 必须是纯函数，需要自己手动处理返回全新的数据保证数据的不可变性

## Effect

`redux` 如果要处理副作用必须引入相应的中间件，比如 `redux-thunk`

## TypeScript 支持

由于 `Action` 的字符串设计，在调用 `dispatch` 时不能提供友好的类型约束及提示
