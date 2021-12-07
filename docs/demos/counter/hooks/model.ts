import { createModel } from 'dobux'
import { RootModel } from './index'

function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const counter = createModel<RootModel, 'counter'>()({
  state: {
    count: 0,
  },
  reducers: {
    increase(state) {
      state.count += 1
    },
    decrease(state) {
      state.count -= 1
    },
  },
  effects: (model, rootModel) => ({
    async increaseAsync() {
      await wait(1000)
      model.reducers.increase()
      return model.effects.decreaseAsync() as number
    },

    async decreaseAsync() {
      await wait(1000)
      return -1
    },
  }),
})
