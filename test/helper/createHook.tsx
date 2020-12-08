import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { MapStateToProps } from '../../src/types'

export function createHook(
  Provider: React.FC,
  hook: any,
  namespace: string,
  mapStateToProps?: MapStateToProps<any>,
) {
  // https://react-hooks-testing-library.com/usage/advanced-hooks#context
  return renderHook(() => hook(namespace, mapStateToProps), {
    wrapper: props => (
      <Provider {...props}>
        {props.children}
      </Provider>
    ),
  })
}
