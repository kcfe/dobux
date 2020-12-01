import React, { createContext, useContext, Context } from 'react'
import { ContextPropsModel, ModelContextProps } from '../types'

type ReturnType = [React.FC, () => ModelContextProps]

const NO_PROVIDER: any = '__NP__'

function createUseContext(context: Context<ModelContextProps>) {
  return (): ModelContextProps => {
    const value = useContext(context)
    return value
  }
}

export function createProvider(model: ContextPropsModel): ReturnType {
  const Context = createContext<ModelContextProps>(NO_PROVIDER)

  const Provider: React.FC = props => {
    return (
      <Context.Provider
        value={{
          model,
        }}
      >
        {props.children}
      </Context.Provider>
    )
  }

  return [Provider, createUseContext(Context)]
}
