import { describe, expect, it } from 'vitest'

import toRounded from '../toRounded'

describe('The toRounded utility function', () => {
  it.each([
    [100, 0, 100],
    [100, 2, 100],
    [1.123, 2, 1.12],
    [1.129, 2, 1.12],
    [1.123, 0, 1],
    [1.123, 10, 1.123],
    [3985, 18, 3985],
  ])('should round %f with a precision of %i to %f', (value, precision, result) => {
    const rounded = toRounded(value, precision)

    expect(rounded).toStrictEqual(result)
  })
})
