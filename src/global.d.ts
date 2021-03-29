import { Noop } from './types'

declare global {
  interface DevtoolExtension {
    connect: (options: { name?: string }) => DevtoolInstance
    disconnect: Noop
  }

  interface DevtoolInstance {
    subscribe: (cb: (message: { type: string; state: any }) => void) => Noop
    send: (actionType: string, payload: Record<string, unknown>) => void
    init: (state: any) => void
  }

  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: DevtoolExtension
  }
}
