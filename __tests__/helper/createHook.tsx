import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { MapStateToModel } from '../../src/types'

export function createHook(
  Provider: React.FC,
  hook: any,
  namespace?: string,
  mapStateToModel?: MapStateToModel<any>
) {
  // https://react-hooks-testing-library.com/usage/advanced-hooks#context
  return renderHook(() => hook(namespace, mapStateToModel), {
    wrapper: props => <Provider {...props}>{props.children}</Provider>,
  })
}
