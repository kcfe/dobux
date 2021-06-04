import { Store } from './core/Store'
import { defaultOptions } from './default'

import { Models, Configs, ConfigReducers, ConfigEffects, Noop, StoreOptions } from './types'
import { getStoreName } from './utils/func'

export { Models }

export function createStore<C extends Configs>(configs: C, options?: StoreOptions<C>): Store<C> {
  const opts = Object.assign(
    {
      name: getStoreName(),
    },
    defaultOptions,
    options
  )

  return new Store(configs, opts)
}

export const createModel: <RM extends Record<string, unknown>, N extends keyof RM>() => <
  S extends any,
  R extends ConfigReducers<S>,
  E extends ConfigEffects<RM[N], RM>
>(model: {
  state: S
  reducers?: R
  effects?: E
}) => {
  state: S
  reducers: R extends ConfigReducers<S> ? R : Record<string, unknown>
  effects: E extends ConfigEffects<RM[N], RM> ? E : Noop<Record<string, unknown>>
} = () => (model): any => {
  const { state, reducers = {}, effects = (): Record<string, unknown> => ({}) } = model

  return {
    state,
    reducers,
    effects,
  }
}
