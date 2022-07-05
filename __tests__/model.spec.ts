import { Model } from '../src/core/Model'

describe('Model test', () => {
  it('Model should be defined', () => {
    expect(Model).toBeDefined()
    expect(Model.prototype.constructor).toBe(Model)
  })

  it('should have valid api', () => {
    expect(Object.keys(Model)).toEqual(['instances'])
    expect(typeof Model.prototype.useModel).toBe('function')
  })
})
