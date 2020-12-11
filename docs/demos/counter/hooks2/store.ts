import { createStore, Models } from 'dobux'
import * as models from './model'

export type RootModel = Models<typeof models>

// 创建 store 实例
export const store = createStore(models)
