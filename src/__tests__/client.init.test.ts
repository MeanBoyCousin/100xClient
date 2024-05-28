import { beforeEach, describe, expect, it, vi } from 'vitest'

import HundredXClient from 'src'
import { Environment } from 'src/enums'
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
      environment: Environment.TESTNET,
      rpc: 'https://test-rpc.quiknode.pro',
      subAccountId: 2,
    })

    expect(Client).toMatchSnapshot()
  })

  it('should POST the referral code if running on mainnet', async () => {
    fetchMock.mockResponse(JSON.stringify({ success: true }))

    new HundredXClient(privateKey, { environment: Environment.MAINNET })

    await vi.waitFor(() => {
      if (!fetchMock.mock.calls.length) throw new Error('Awaiting call...')
    })

    expect(fetchMock.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "https://api.100x.finance/v1/referral/add-referee",
        {
          "body": "{"account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","code":"kickflip","signature":"0x0bf1266ca5b8542e07d2258e5532613f96dd6ddeedaccb4b3166016711bbd0ad600674fc14fb86b985d79f188928822286f1de586e108824d72dc3fbda49783e1c"}",
          "method": "POST",
        },
      ]
    `)
  })

  it('should handle referral failures gracefully', async () => {
    fetchMock.mockReject(new Error('An unknown error occurred'))

    const Client = new HundredXClient(privateKey, { debug: true, environment: Environment.MAINNET })

    await vi.waitFor(() => {
      if (Client.logs.length !== 4) throw new Error('Awaiting call...')
    })

    expect(Client.logs[3]).toEqual({ msg: 'Call failed, ignoring.' })
  })
})
