import { useState, useRef, useEffect, Dispatch } from 'react'
import produce from 'immer'
import { 
  ConfigReducer, 
  ContextPropsModel, 
  MapStateToProps, 
  ModelConfig, 
  ModelConfigEffect, 
  ModelContextProps, 
  StateSubscriber 
} from '../types'
import { invariant } from '../utils/invariant'
import { isObject } from '../utils/type'
import { createProvider } from './createProvider'
import { Container } from './Container'
import { noop } from '../utils/func'

interface ModelOptions<C extends ModelConfig> {
  storeName: string
  name: string
  config: C
  rootModel: Record<string, unknown>
  autoReset: boolean
  devTools: boolean
}

export class Model<C extends ModelConfig> {
  public Provider: React.FC

  private model: ContextPropsModel<C>
  private initialState: C['state']

  private container: Container<C['state']>
  private currentDispatcher: Dispatch<any> = noop
  private isInternalUpdate = false

  private useContext: () => ModelContextProps
  
  constructor(private options: ModelOptions<C>) {
    const { name, config, rootModel } = options
    
    this.initialState = config.state
    this.model = this.initModel(config)
    this.container = new Container<C['state']>()

    rootModel[name] = this.model

    const [Provider, useContext] = createProvider(this.model)

    this.Provider = Provider
    this.useContext = useContext
  }

  public useModel(mapStateToProps: MapStateToProps<C['state']>): any {
    const [, dispatcher] = useState()
    const { model } = this.useContext()

    this.currentDispatcher = dispatcher

    const subscriberRef = useRef<StateSubscriber<C['state']>>()

    // make sure only subscribe once
    if (!subscriberRef.current) {
      const subscriber = {
        dispatcher,
        mapStateToProps,
        prevState: mapStateToProps(this.model.state),
      }

      subscriberRef.current = subscriber
      this.container.subscribe('state', subscriber)
    }

    useEffect(() => {
      return (): void => {
        // unsubscribe when component unmount
        this.container.unsubscribe('state', subscriberRef.current as StateSubscriber<C['state']>)
        this.container.unsubscribe('effect', dispatcher)
      }
    }, [])

    invariant(
      isObject(model),
      '[store.useModel] You should add <Provider></Provider> or withProvider() in the upper layer when calling useModel'
    )

    const state = mapStateToProps(model.state)

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
        reducer(draft, ...payload)
      })
    } else {
      newState = reducer(state, ...payload)
    }

    return newState
  }

  private notify(name: string, state: C['state']): void {
    this.container.notify(state)
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

        this.notify('setValues', newState)
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

      const effect: ModelConfigEffect<typeof originEffect> = async (...payload: any): Promise<void> => {
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
          if(newValue !== value && that.isInternalUpdate) {
            value = newValue
            that.container.notify()
          }
        }
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
}
