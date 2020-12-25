import { shallowEqual } from '../utils/shallowEqual'
import { StateSubscriber, EffectSubscriber } from '../types'

type SubscribeType = 'state' | 'effect'

export class Container<T> {
  private stateSubscribers: StateSubscriber<T>[] = []
  private effectSubscribers: EffectSubscriber[] = []

  public subscribe(type: 'state', payload: StateSubscriber<T>): void
  public subscribe(type: 'effect', payload: EffectSubscriber): void
  public subscribe(type: SubscribeType, payload: StateSubscriber<T> | EffectSubscriber): void {
    if (type === 'state') {
      const stateSubscriber = payload as StateSubscriber<T>

      /* istanbul ignore else */
      if (this.stateSubscribers.indexOf(stateSubscriber) === -1) {
        this.stateSubscribers.push(stateSubscriber)
      }
    } /* istanbul ignore else */ else if (type === 'effect') {
      const effectSubscriber = payload as EffectSubscriber
      /* istanbul ignore else */
      if (this.effectSubscribers.indexOf(effectSubscriber) === -1) {
        this.effectSubscribers.push(effectSubscriber)
      }
    }
  }

  public notify(payload?: T): void {
    if (payload) {
      for (let i = 0; i < this.stateSubscribers.length; i++) {
        const { dispatcher, mapStateToModel, prevState } = this.stateSubscribers[i]

        const newState = mapStateToModel(payload)

        this.stateSubscribers[i].prevState = newState

        if (!shallowEqual(prevState, newState)) {
          dispatcher(Object.create(null))
        }
      }
    } else {
      for (let i = 0; i < this.effectSubscribers.length; i++) {
        const dispatcher = this.effectSubscribers[i]
        dispatcher(Object.create(null))
      }
    }
  }

  public unsubscribe(type: 'state', payload: StateSubscriber<T>): void
  public unsubscribe(type: 'effect', payload: EffectSubscriber): void
  public unsubscribe(type: SubscribeType, payload: StateSubscriber<T> | EffectSubscriber): void {
    if (type === 'state') {
      const index = this.stateSubscribers.indexOf(payload as StateSubscriber<T>)
      this.stateSubscribers.splice(index, 1)
    } /* istanbul ignore else */ else if (type === 'effect') {
      const index = this.effectSubscribers.indexOf(payload as EffectSubscriber)
      this.effectSubscribers.splice(index, 1)
    }
  }
}
