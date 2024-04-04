import { vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'log').mockImplementation(() => {})

const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()

Object.defineProperty(BigInt.prototype, 'toJSON', {
  get() {
    'use strict'
    return () => String(this)
  },
})
