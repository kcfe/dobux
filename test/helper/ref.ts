export const unsafeGetTestingRef = (tree, component) => {
  // Unsafe way to get access to a ref property. Uses internal _fiber property of a ReactTestingInstance since AFAIK react-test-renderer does not expose refs in any other way
  const node = tree.root.findByType(component)

  expect(node).not.toBeNull()
  expect(node._fiber).not.toBeNull()
  expect(node._fiber).not.toBeUndefined()

  const ref = node._fiber.ref

  expect(ref).not.toBeNull()
  expect(ref).not.toBeUndefined()

  return ref
}
