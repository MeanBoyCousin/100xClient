import { beforeEach, describe, expect, it, vi } from 'vitest'

import HundredXClient from 'src'
import { privateKey } from 'vitest/utils'

describe('The HundredXClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should initialise correctly with only required params', () => {
    const Client = new HundredXClient(privateKey)

    expect(Client).toMatchSnapshot()
  })

  it('should initialise correctly with all config parameters passed', () => {
    const Client = new HundredXClient(privateKey, {
      debug: true,
      environment: 'testnet',
      rpc: 'https://test-rpc.quiknode.pro',
      subAccountId: 2,
    })

    expect(Client).toMatchSnapshot()
  })

  it('should POST the referral code if running on mainnet', async () => {
    fetchMock.mockResponse(JSON.stringify({ success: true }))

    new HundredXClient(privateKey, { environment: 'mainnet' })

    await vi.waitFor(() => {
      if (!fetchMock.mock.calls.length) throw new Error('Awaiting call...')
    })

    expect(fetchMock.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "https://api.100x.finance/v1/referral/add-referee",
        {
          "body": "{"account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","code":"kickflip","signature":"0x5da080cbf906558a2642b7642572b3a5c75966e2bf3f9a8c5b86e77ef7b6395c3557266aa6971790d65f3c791d68e7894285f18bf16cecf5b9b06b53715fc1d21b"}",
          "method": "POST",
        },
      ]
    `)
  })

  it('should handle referral failures gracefully', async () => {
    fetchMock.mockReject(new Error('An unknown error occurred'))

    const Client = new HundredXClient(privateKey, { debug: true, environment: 'mainnet' })

    await vi.waitFor(() => {
      if (Client.logs.length !== 4) throw new Error('Awaiting call...')
    })

    expect(Client.logs[3]).toEqual({ msg: 'Call failed, ignoring.' })
  })
})
