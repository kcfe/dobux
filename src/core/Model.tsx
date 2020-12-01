import { useState, useRef, useEffect } from 'react'
import { ModelConfig } from '../types'

interface ModelOptions<C extends ModelConfig> {
  storeName: string
  name: string
  config: C
  rootModel: Record<string, unknown>
  autoReset: boolean
  devTools: boolean
}

export class Model<C extends ModelConfig> {
  constructor(private options: ModelOptions<C>) {
    
  }
}
