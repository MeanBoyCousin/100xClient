import type { HexString } from 'src/types'

import { recoverTypedDataAddress } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HundredXClient from 'src'
import EIP712 from 'src/ABI/EIP712'
import { address, mockBalances, privateKey } from 'vitest/utils'

describe('The HundredXClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(1709829760000)
  })

  describe('listBalances function', () => {
    it('should allow a user to fetch their balances', async () => {
      fetchMock.mockResponse(JSON.stringify(mockBalances))

      const Client = new HundredXClient(privateKey)

      const result = await Client.listBalances()
      const call = fetchMock.mock.calls[0]

      expect(
        await recoverTypedDataAddress({
          domain: Client.domain,
          message: {
            account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
            subAccountId: 1,
          },
          primaryType: 'SignedAuthentication',
          signature: new URL(call[0] as string).searchParams.get('signature') as HexString,
          types: EIP712,
        }),
      ).toEqual(address)
      expect(call).toMatchInlineSnapshot(`
        [
          "https://api.ciaobella.dev/v1/balances?account=0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8&signature=0xeeeabb738b08cce6097a3a64289cf90fc4d5802c4b49c8050f879654d7d3d0061fea6f9dbcf18b2eedf5e26778a24fb64cf41ab05be615a57891112e6348e0231c&subAccountId=1",
          undefined,
        ]
      `)
      expect(result).toEqual({
        balances: [
          {
            address: '0x79a59c326c715ac2d31c169c85d1232319e341ce',
            asset: 'USDB',
            pendingWithdrawal: '0',
            quantity: '100000000000000000000',
          },
        ],
      })
    })

    it('should handle an error during the order process', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'A known error occurred' }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.listBalances()

      expect(result).toEqual({
        balances: [],
        error: {
          message: 'A known error occurred',
        },
      })
    })

    it('should handle an unknown error', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.listBalances()

      expect(result).toEqual({
        balances: [],
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
      })
    })
  })
})
