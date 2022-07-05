import { createModel } from '../../src'
import { RootModel } from './store'
import { config } from './shared'

export const counter = createModel<RootModel, 'counter'>()(config)

export const counter2 = createModel<RootModel, 'counter2'>()(config)
