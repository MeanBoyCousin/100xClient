import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import sleep from '../sleep'

const mock = vi.fn()

const mockFunction = async (sleepTime: number) => {
  await sleep(sleepTime)

  mock()
}

describe('The sleep utility function', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should block until the specified ms has elapsed', async () => {
    mockFunction(10000)
    await vi.advanceTimersByTimeAsync(5000)

    expect(mock).not.toHaveBeenCalledOnce()

    await vi.advanceTimersByTimeAsync(5000)

    expect(mock).toHaveBeenCalledOnce()
  })
})
