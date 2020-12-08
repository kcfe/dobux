import { createStore, Models } from '../../src'
import * as models from './model'

export type RootModel = Models<typeof models>

const store = createStore({ ...models })

export default store
