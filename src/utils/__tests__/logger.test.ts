import { beforeEach, describe, expect, it, vi } from 'vitest'

import logger from '../logger'

describe('The logger util function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return correctly for a failure', () => {
    logger.failure('Fail message.')

    expect(console.error).toHaveBeenCalledWith('❗ ', 'Fail message.')
  })

  it('should return correctly for a message', () => {
    logger.message('Message.')

    expect(console.log).toHaveBeenCalledWith('\x1b[33m⟶\x1b[0m  ', 'Message.')
  })

  it('should return correctly for a success', () => {
    logger.success('Success message.')

    expect(console.log).toHaveBeenCalledWith('✨ ', 'Success message.')
  })

  it('should return correctly for a waiting', () => {
    logger.waiting('Waiting message.')

    expect(console.log).toHaveBeenCalledWith('⌛ ', 'Waiting message.')
  })
})
