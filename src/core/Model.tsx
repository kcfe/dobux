import { useState, useRef, useEffect, Dispatch } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import produce from 'immer'
import {
  ConfigReducer,
  ContextPropsModel,
  MapStateToModel,
  ModelConfig,
  ModelConfigEffect,
  ModelContextProps,
  Noop,
  StateSubscriber,
} from '../types'
import { invariant } from '../utils/invariant'
import { isFunction, isObject } from '../utils/type'
import { createProvider } from './createProvider'
import { Container } from './Container'
import { noop } from '../utils/func'
import { isDev } from '../common/env'

interface ModelOptions<C extends ModelConfig> {
  storeName: string
  name: string
  config: C
  rootModel: Record<string, unknown>
  autoReset: boolean
  devtools: boolean
}
interface ModelInstance {
  [key: string]: number
}

/* istanbul ignore next */
const devtoolExtension =
  isDev && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__

export class Model<C extends ModelConfig> {
  static instances: ModelInstance = Object.create(null)

  private model: ContextPropsModel<C>
  private initialState: C['state']

  private container = new Container<C['state']>()
  private currentDispatcher: Dispatch<any> = noop
  private isInternalUpdate = false

  private instanceName: string
  private devtoolInstance?: DevtoolInstance
  private unsubscribeDevtool?: Noop
  private isTimeTravel = false

  public Provider: React.FC
  private useContext: () => ModelContextProps

  constructor(private options: ModelOptions<C>) {
    const { storeName, name, config, rootModel } = options

    this.instanceName = `${storeName}/${name}`

    /* istanbul ignore else  */
    if (!Model.instances[this.instanceName]) {
      Model.instances[this.instanceName] = 0
    }

    this.initialState = config.state
    this.model = this.initModel(config)

    rootModel[name] = this.model

    const [Provider, useContext] = createProvider(this.model)

    this.Provider = Provider
    this.useContext = useContext
  }

  public useModel(mapStateToModel: MapStateToModel<C['state']>): any {
    const [, dispatcher] = useState()
    const { model } = this.useContext()

    this.currentDispatcher = dispatcher

    const subscriberRef = useRef<StateSubscriber<C['state']>>()

    // make sure only subscribe once
    if (!subscriberRef.current) {
      const subscriber = {
        dispatcher,
        mapStateToModel,
        prevState: mapStateToModel(this.model.state),
      }

      subscriberRef.current = subscriber
      this.container.subscribe('state', subscriber)
    }

    useEffect(() => {
      /* istanbul ignore else */
      if (this.options.devtools) {
        // a Model only creates one devtool instance
        if (Model.instances[this.instanceName] === 0) {
          this.initDevtools()
        }

        Model.instances[this.instanceName]++
      }

      return (): void => {
        if (this.options.autoReset) {
          this.model.state = this.initialState
        }

        // unsubscribe when component unmount
        this.container.unsubscribe('state', subscriberRef.current as StateSubscriber<C['state']>)
        this.container.unsubscribe('effect', dispatcher)

        /* istanbul ignore next */
        if (isFunction(this.unsubscribeDevtool)) {
          Model.instances[this.instanceName]--

          // disconnect after all dependent components are destroyed
          if (Model.instances[this.instanceName] <= 0) {
            this.unsubscribeDevtool()
            devtoolExtension && devtoolExtension.disconnect?.()
          }
        }
      }
    }, [])

    invariant(
      isObject(model),
      '[store.useModel] You should add <Provider></Provider> or withProvider() in the upper layer when calling useModel'
    )

    const state = mapStateToModel(model.state)

    return {
      state,
      reducers: model.reducers,
      effects: model.effects,
    }
  }

  private produceState(state: C['state'], reducer: ConfigReducer, payload: any = []): C['state'] {
    let newState

    if (typeof state === 'object') {
      newState = produce(state, draft => {
        return reducer(draft, ...payload)
      })
    } else {
      newState = reducer(state, ...payload)
    }

    return newState
  }

  private notify(name: string, state: C['state']): void {
    /* istanbul ignore next */
    if (this.devtoolInstance) {
      this.devtoolInstance.send?.(`${this.options.name}/${name}`, state)
    }

    batchedUpdates(this.container.notify.bind(this.container, state))
  }

  private getReducers(config: C): ContextPropsModel<C>['reducers'] {
    const reducers: ContextPropsModel<C>['reducers'] = Object.keys(config.reducers).reduce(
      (reducers, name) => {
        const originReducer = config.reducers[name]

        const reducer = (...payload: any[]): void => {
          const newState = this.produceState(this.model.state, originReducer, payload)

          this.model.state = newState
          this.notify(name, newState)
        }

        reducers[name] = reducer
        return reducers
      },
      Object.create(null)
    )

    // internal reducer setValue
    if (!reducers.setValue) {
      reducers.setValue = (key, value): void => {
        const newState = this.produceState(this.model.state, draft => {
          draft[key] = value
        })

        this.model.state = newState
        this.notify('setValue', newState)
      }
    }

    // internal reducer setValues
    if (!reducers.setValues) {
      reducers.setValues = (partialState): void => {
        const newState = this.produceState(this.model.state, draft => {
          Object.keys(partialState).forEach(key => {
            draft[key] = partialState[key]
          })
        })

        this.model.state = newState

        /* istanbul ignore next */
        if (this.isTimeTravel) {
          this.container.notify(newState)
        } else {
          this.notify('setValues', newState)
        }
      }
    }

    // internal reducer reset
    if (!reducers.reset) {
      reducers.reset = (key): void => {
        const newState = this.produceState(this.model.state, draft => {
          if (key) {
            draft[key] = this.initialState[key]
          } else {
            Object.keys(this.initialState).forEach(key => {
              draft[key] = this.initialState[key]
            })
          }
        })

        this.model.state = newState
        this.notify('reset', newState)
      }
    }

    return reducers
  }

  private getEffects(config: C): ContextPropsModel<C>['effects'] {
    return Object.keys(config.effects).reduce((effects, name) => {
      const originEffect = config.effects[name]

      const effect: ModelConfigEffect<typeof originEffect> = async (
        ...payload: any[]
      ): Promise<void> => {
        try {
          effect.identifier++

          this.isInternalUpdate = true
          effect.loading = true
          this.isInternalUpdate = false

          const result = await originEffect(...payload)
          return result
        } catch (error) {
          throw error
        } finally {
          effect.identifier--

          /* istanbul ignore else */
          if (effect.identifier === 0) {
            this.isInternalUpdate = true
            effect.loading = false
            this.isInternalUpdate = false
          }
        }
      }

      effect.loading = false
      effect.identifier = 0

      let value = false
      const that = this

      Object.defineProperty(effect, 'loading', {
        configurable: false,
        enumerable: true,

        get() {
          that.container.subscribe('effect', that.currentDispatcher)
          return value
        },

        set(newValue) {
          // avoid modify effect loading out of internal
          /* istanbul ignore else */
          if (newValue !== value && that.isInternalUpdate) {
            value = newValue
            that.container.notify()
          }
        },
      })

      effects[name] = effect

      return effects
    }, Object.create(null))
  }

  private initModel(config: C): ContextPropsModel<C> {
    // @ts-ignore
    config.reducers = this.getReducers(config)
    // @ts-ignore
    config.effects = this.getEffects(config)

    // @ts-ignore
    return config
  }

  private initDevtools(): void {
    /* istanbul ignore next */
    if (devtoolExtension && isFunction(devtoolExtension.connect)) {
      // https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#name
      this.devtoolInstance = devtoolExtension.connect({
        name: this.instanceName,
      })

      if (isFunction(this.devtoolInstance?.subscribe) && isFunction(this.devtoolInstance?.init)) {
        this.unsubscribeDevtool = this.devtoolInstance.subscribe(
          /* istanbul ignore next */ message => {
            if (message.type === 'DISPATCH' && message.state) {
              this.isTimeTravel = true
              this.model.reducers.setValues(JSON.parse(message.state))
              this.isTimeTravel = false
            }
          }
        )

        this.devtoolInstance.init(this.initialState)
      }
    }
  }
}
