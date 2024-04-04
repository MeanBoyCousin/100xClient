import { beforeEach, describe, expect, it, vi } from 'vitest'

import logger from '../logger'

vi.spyOn(console, 'error')
vi.spyOn(console, 'log')

describe('The logger util function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return correctly for a failure', () => {
    logger.failure('Fail message.')

    expect(console.error).toHaveBeenCalledWith('\x1b[31m✖\x1b[0m', 'Fail message.')
  })

  it('should return correctly for a message', () => {
    logger.message('Message.')

    expect(console.log).toHaveBeenCalledWith('\x1b[33m→\x1b[0m', 'Message.')
  })

  it('should return correctly for a success', () => {
    logger.success('Success message.')

    expect(console.log).toHaveBeenCalledWith('\x1b[32m✔\x1b[0m', 'Success message.')
  })
})
