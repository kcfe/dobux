import { createStore, Models } from '../../src'
import * as models from './model'

export type RootModel = Models<typeof models>

export const store = createStore({ ...models })
