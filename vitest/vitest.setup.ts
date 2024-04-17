import { vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

vi.mock('src/constants/api.ts')
vi.mock('src/constants/ciao.ts')
vi.mock('src/constants/verifier.ts')

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
