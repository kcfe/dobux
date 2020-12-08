import { createModel } from '../../src'
import { RootModel } from './store'
import { config } from './shared'

export const counter = createModel<RootModel, 'counter'>()(config)
