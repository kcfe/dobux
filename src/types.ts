import { Dispatch } from 'react'

type Push<L extends any[], T> = ((r: any, ...x: L) => void) extends (...x: infer L2) => void
  ? { [K in keyof L2]-?: K extends keyof L ? L[K] : T }
  : never

// convert a union to an intersection: X | Y | Z ==> X & Y & Z
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

// convert a union to an overloaded function X | Y ==> ((x: X)=>void) & ((y:Y)=>void)
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>

// convert a union to a tuple X | Y => [X, Y]
// a union of too many elements will become an array instead
type UnionToTuple<U> = UTT0<U> extends infer T
  ? T extends any[]
    ? Exclude<U, T[number]> extends never
      ? T
      : U[]
    : never
  : never

// each type function below pulls the last element off the union and
// pushes it onto the list it builds
type UTT0<U> = UnionToOvlds<U> extends (a: infer A) => void ? Push<UTT1<Exclude<U, A>>, A> : []
type UTT1<U> = UnionToOvlds<U> extends (a: infer A) => void ? Push<UTT2<Exclude<U, A>>, A> : []
type UTT2<U> = UnionToOvlds<U> extends (a: infer A) => void ? Push<UTT3<Exclude<U, A>>, A> : []
type UTT3<U> = UnionToOvlds<U> extends (a: infer A) => void ? Push<UTT4<Exclude<U, A>>, A> : []
type UTT4<U> = UnionToOvlds<U> extends (a: infer A) => void ? Push<UTT5<Exclude<U, A>>, A> : []
type UTT5<U> = UnionToOvlds<U> extends (a: infer A) => void ? Push<UTTX<Exclude<U, A>>, A> : []
type UTTX<U> = []

export interface Noop<R = any> {
  (...args: any[]): R
}

export interface ConfigReducer<S = any> {
  (state: S, ...payload: any): void
}

export interface ConfigReducers<S = any> {
  [name: string]: ConfigReducer<S>
}

export interface ConfigEffect {
  (...payload: any[]): any
}

export interface ConfigEffects<M = any, RM = any> {
  (model: M, rootModel: RM): { [key: string]: ConfigEffect }
}

export interface Config<S = any> {
  state: S
  reducers: ConfigReducers<S>
  effects: ConfigEffects
}

export interface Configs {
  [key: string]: Config
}

interface ModelEffectState {
  readonly loading: boolean
}

interface BuildInReducers<S = any> {
  setValue: <K extends keyof S>(key: K, value: S[K]) => void
  setValues: (state: Partial<S>) => void
  reset: <K extends keyof S>(key?: K) => void
}

type ModelReducer<MR extends ConfigReducer> = MR extends (state: any, ...payload: infer P) => void
  ? (...payload: P) => void
  : any

export type ModelReducers<R extends ConfigReducers, S = any> = {
  [K in keyof R]: ModelReducer<R[K]>
} &
  BuildInReducers<S>

export type ModelEffect<E extends ConfigEffect> = (E extends (...payload: infer P) => infer R
  ? (...payload: P) => R
  : any) &
  ModelEffectState

export type ModelEffects<C extends { [key: string]: ConfigEffect }> = {
  [K in keyof C]: ModelEffect<C[K]>
}

export interface Model<C extends Config, S = undefined, R = undefined, E = undefined> {
  state: S extends undefined ? C['state'] : S
  reducers: R extends undefined
    ? C['reducers'] extends ConfigReducers
      ? ModelReducers<C['reducers'], C['state']>
      : BuildInReducers<C['state']>
    : R
  effects: E extends undefined
    ? C['effects'] extends ConfigEffects
      ? ModelEffects<ReturnType<C['effects']>>
      : Record<string, unknown>
    : E
}

export type Models<C extends Configs, S = undefined, R = undefined, E = undefined> = {
  [K in keyof C]: {
    state: Model<C[K], S, R, E>['state']
    reducers: Model<C[K], S, R, E>['reducers']
    effects: Model<C[K], S, R, E>['effects']
  }
}

export type ModelState<C extends Configs> = {
  [K in keyof C]: C[K]['state']
}
export interface ModelConfig<S = any> {
  state: S
  reducers: ConfigReducers<S>
  effects: { [key: string]: ConfigEffect }
}

export type ModelConfigEffect<E extends ConfigEffect> = (E extends (...payload: infer P) => infer R
  ? (...payload: P) => R
  : any) & {
  loading: boolean
  identifier: number
}

export interface ContextPropsModel<C extends ModelConfig = any> {
  state: C['state']
  reducers: C['reducers'] extends ConfigReducers<C['state']>
    ? ModelReducers<C['reducers'], C['state']>
    : BuildInReducers<C['state']>
  effects: C['effects'] extends ConfigEffects
    ? ModelEffects<ReturnType<C['effects']>>
    : Record<string, unknown>
}

export interface ModelProviderOptions {
  autoReset?: boolean
  devtools?: boolean
}

export interface ModelContextProps {
  model: ContextPropsModel
}

export type StoreProvider = React.FC<React.PropsWithChildren<any>>

export interface StoreOptions<C extends Configs> {
  name?: string
  autoReset?: boolean | UnionToTuple<keyof C>
  devtools?: boolean | UnionToTuple<keyof C>
}

export type HOC<InjectProps = any> = <P>(
  Component: React.ComponentType<P & InjectProps>
) => React.ComponentType<P>

export type Optionality<T extends K, K> = Omit<T, keyof K>

export interface StateSubscriber<T> {
  mapStateToModel: MapStateToModel<any>
  prevState: T
  dispatcher: Dispatch<any>
}

export type EffectSubscriber = Dispatch<any>

export interface MapStateToModel<M extends Model<any>, S = any> {
  (state: M['state']): S
}
