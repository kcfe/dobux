import { createStore, Models } from 'dobux'
import * as models from './models'

export type RootModel = Models<typeof models>

export const store = createStore(models)
