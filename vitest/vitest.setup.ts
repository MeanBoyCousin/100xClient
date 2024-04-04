import { vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()

Object.defineProperty(BigInt.prototype, 'toJSON', {
  get() {
    'use strict'
    return () => String(this)
  },
})
