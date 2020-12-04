import { createModel } from 'dobux'
import { RootModel } from '../store'

function fetchList(): Promise<{ data: any[] }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: [
          {
            content: 'Learn dobux',
          },
          {
            content: 'Learn typescript',
          },
        ],
      })
    }, 1000)
  })
}

interface Item {
  done?: boolean
  content: string
}

export const undoList = createModel<RootModel, 'undoList'>()({
  state: {
    items: [
      {
        content: 'Learn dobux',
      },
      {
        content: 'Learn typescript',
      },
    ] as Item[],
  },
  reducers: {
    addItem(state, item: Item) {
      state.items.push(item)
    },

    deleteItem(state, index: number) {
      state.items.splice(index, 1)
    },

    toggleItem(state, index: number) {
      state.items[index].done = !state.items[index].done
    },
  },
  effects: (model) => ({
    async fetchUndoList() {
      const result = await fetchList()
      model.reducers.setValue('items', result.data as any)
    },
  }),
})
