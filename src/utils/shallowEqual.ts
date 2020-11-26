function is(a: any, b: any): boolean {
  if (a === b) {
    // 0 !== -0
    return a !== 0 || b !== 0 || 1 / a === 1 / b
  } else {
    // NaN !== NaN
    return a !== a && b !== b
  }
}

const hasOwn = Object.prototype.hasOwnProperty

export function shallowEqual(objA: any, objB: any): boolean {
  if (is(objA, objB)) {
    return true
  }

  if (typeof objA !== 'object' || typeof objB !== 'object' || !objA || !objB) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i]

    if (!hasOwn.call(objB, key) || !is(objA[key], objB[key])) {
      return false
    }
  }

  return true
}
