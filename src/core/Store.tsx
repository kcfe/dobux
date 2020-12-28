import React from 'react'
import { Model } from './Model'
import { isObject, isArray, isUndefined, isNull, isFunction } from '../utils/type'
import { invariant } from '../utils/invariant'

import { Configs, StoreOptions, ModelConfig, StoreProvider, MapStateToModel, Models, ModelState, HOC } from '../types'

type StoreModels<C extends Configs> = {
  [K in keyof C]: Model<ModelConfig<C[K]['state']>>
}

export class Store<C extends Configs> {
  private models: StoreModels<C>
  private rootModel = Object.create(null)
  
  constructor(private configs: C, options: Required<StoreOptions<C>>) {    
    this.models = this.initModels(configs, options)
    this.getState = this.getState.bind(this)
  }

  public Provider: StoreProvider = ({ children }): React.ReactElement => {
    Object.keys(this.models).forEach(namespace => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Provider } = this.models[namespace]
      children = <Provider>{children}</Provider>
    })

    return <>{children}</>
  }

  public withProvider = <T extends Record<string, unknown>>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Component: React.ComponentType<T>,
  ) => {
    return (props: T): React.ReactElement => {
      return (
        <this.Provider>
          <Component {...props} />
        </this.Provider>
      )
    }
  }

  public useModel = <K extends keyof C, S = undefined, R = undefined, E = undefined>(
    modelName: K,
    mapStateToModel: MapStateToModel<Models<C>[K], S> = (state: S): S => state
  ): Models<C, S, R, E>[K] => {
    invariant(!isUndefined(modelName), `[store.useModel] Expected the modelName not to be empty`)

    const modelNames = Object.keys(this.configs)

    invariant(modelNames.indexOf(modelName as string) > -1, `[store.useModel] Expected the modelName to be one of ${modelNames}, but got ${modelName}`)

    invariant(
      isUndefined(mapStateToModel) || isFunction(mapStateToModel),
      `[store.useModel] Expected the mapStateToModel to be function or undefined, but got ${typeof mapStateToModel}`
    )

    return this.models[modelName].useModel(mapStateToModel)
  }

  public withModel = <K extends keyof C, S = undefined>(
    modelName: K,
    mapStateToModel?: MapStateToModel<Models<C>[K], S>
  ): HOC => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Component => {
      return (props): React.ReactElement => {
        const store = this.useModel(modelName, mapStateToModel)
        return <Component {...store} {...props} />
      }
    }
  }

  public getState(): ModelState<C>
  public getState<K extends keyof C>(modelName: K): C[K]['state']
  public getState<K extends keyof C>(modelName?: K) {
    if (modelName) {
      const modelNames = Object.keys(this.configs)
      invariant(modelNames.indexOf(modelName as string) > -1, `[store.getState] Expected the modelName to be one of ${modelNames}, but got ${modelName}`)

      return this.rootModel[modelName].state
    } else {
      const state = Object.keys(this.rootModel).reduce((state, modelName) => {
        state[modelName] = this.rootModel[modelName].state
        return state
      }, Object.create(null))

      return state
    }
  }

  private initModels(configs: C, options: Required<StoreOptions<C>>): StoreModels<C> {
    const { name: storeName, autoReset, devtools } = options
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
      config.effects = effects(config, this.rootModel)
        
      models[name] = new Model({
        storeName,
        name,
        config,
        rootModel: this.rootModel,
        autoReset: isArray(autoReset) ? (autoReset as any[]).indexOf(name) > -1 : autoReset,
        devtools: isArray(devtools) ? (devtools as any[]).indexOf(name) > -1 : devtools,
      })

      return models
    }, Object.create(null))
  }
}
