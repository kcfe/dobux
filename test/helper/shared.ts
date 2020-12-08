export function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const defaultStoreOptions = {
  autoReset: false,
  devtools: true,
  name: 'dobuxStore',
}

export const config = {
  state: {
    count: 0,
    data: {},
  },
  reducers: {
    increase(state: any) {
      state.count++
    },
    decrease(state: any) {
      state.count--
    },
  },
  effects: (store: any, rootStore: any) => ({
    async increaseAsync() {
      await wait(500)
      store.reducers.increase()
    },

    async fetchError() {
      return new Promise((_, reject) => {
        reject('customer error')
      })
    },
  }),
}

export const defaultModelOptions = {
  storeName: 'dobuxStore',
  name: 'counter',
  config: {
    ...config,
    effects: {},
  },
  rootModel: Object.create(null),
  autoReset: false,
  devTools: true,
}
