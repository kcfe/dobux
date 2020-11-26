import React from 'react'
import { Model } from './Model'
import { isObject, isArray, isUndefined, isFunction, isNull } from '../utils/type'
import { invariant } from '../utils/invariant'

import { Configs, StoreOptions, ModelConfig } from '../types'

type StoreModels<C extends Configs> = {
  [K in keyof C]: Model<ModelConfig<C[K]['state']>>
}

export class Store<C extends Configs> {
  private models: StoreModels<C>
  
  constructor(configs: C, options: StoreOptions<C>) {    
    this.models = this.initModels(configs, options)
  }

  private initModels(configs: C, options: StoreOptions<C>): StoreModels<C> {
    const { name: storeName, autoReset, devTools } = options
    const rootModel = Object.create(null)
    const modelNames = Object.keys(configs)

    invariant(modelNames.length > 0, `createStore requires at least one configuration`)

    return modelNames.reduce((models, name) => {
      const { state, reducers, effects } = configs[name]

      invariant(
        !isUndefined(state) && !isNull(state),
        `[createStore] Expected the state of ${name} not to be undefined`
      )

      const config = Object.create(null)

      config.state = isObject(state) ? { ...state } : isArray(state) ? [...state] : state
      config.reducers =  { ...reducers }
      config.effects = effects(config, rootModel)
        
      models[name] = new Model({
        storeName,
        name,
        config,
        rootModel,
        autoReset: isArray(autoReset) ? (autoReset as any[]).indexOf(name) > -1 : autoReset,
        devTools: isArray(devTools) ? (devTools as any[]).indexOf(name) > -1 : devTools,
      })

      return models
    }, Object.create(null))
  }
}
