import { createModel } from 'dobux'
import { RootModel } from '../store'

export const header = createModel<RootModel, 'header'>()({
  state: {
    value: '',
  },
  reducers: {
    changeValue(state, payload: string) {
      state.value = payload
    },
  },
  effects: (model, rootModel) => ({
    addUndoItem() {
      rootModel.undoList.reducers.addItem({
        content: model.state.value,
      })
    },
  }),
})
