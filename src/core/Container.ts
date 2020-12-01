import { shallowEqual } from '../utils/shallowEqual'
import { Subscriber } from '../types'

export class Container<T> {
  private subscribers: Subscriber<T>[] = []

  notify(payload?: T): void {
    for (let i = 0; i < this.subscribers.length; i++) {
      const { dispatcher, mapStateToProps, prevState } = this.subscribers[i]

      const newState = payload ? mapStateToProps(payload) : prevState

      this.subscribers[i].prevState = newState

      if (!shallowEqual(prevState, newState)) {
        dispatcher(Object.create(null))
      }
    }
  }
}
