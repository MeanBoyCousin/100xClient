import { recoverTypedDataAddress } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HundredXClient from 'src'
import EIP712 from 'src/ABI/EIP712'
import { USDB, privateKey } from 'vitest/utils'

describe('The HundredXClient withdraw function', () => {
  beforeEach(() => {
    vi.setSystemTime(1709829760000)
  })

  it('should allow a user to successfully withdraw', async () => {
    fetchMock.mockResponse(JSON.stringify({ success: true }))

    const Client = new HundredXClient(privateKey)

    const result = await Client.withdraw(100)
    const call = fetchMock.mock.calls[0]

    expect(
      await recoverTypedDataAddress({
        domain: Client.domain,
        message: {
          account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
          asset: USDB,
          subAccountId: 1,
          nonce: 1709829760000n,
          quantity: 100000000000000000000n,
        },
        primaryType: 'Withdraw',
        signature: JSON.parse(call[1]?.body as string).signature,
        types: EIP712,
      }),
    ).toEqual('0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8')
    expect(call).toMatchInlineSnapshot(`
      [
        "https://api.staging.100x.finance/v1/withdraw",
        {
          "body": "{"account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","asset":"0x79a59c326c715ac2d31c169c85d1232319e341ce","subAccountId":1,"nonce":1709829760000,"quantity":"100000000000000000000","signature":"0xb73989bc4a7f61f830194483004a8b71865baa2559103ec34fcc106015a7aa5a3f8f47c191838a5e805eca92381df816bf2f96f6228175f0161bfaec4a9091331c"}",
          "method": "POST",
        },
      ]
    `)
    expect(result).toEqual({ success: true })
  })

  it('should handle an error during the withdrawal process', async () => {
    fetchMock.mockResponse(JSON.stringify({ error: 'A known error occurred' }))

    const Client = new HundredXClient(privateKey)

    const result = await Client.withdraw(100)

    expect(result).toEqual({
      error: {
        message: 'A known error occurred',
      },
      success: false,
    })
  })

  it('should handle an unknown error', async () => {
    fetchMock.mockReject(new Error('An unknown error occurred'))

    const Client = new HundredXClient(privateKey)

    const result = await Client.withdraw(100)

    expect(result).toEqual({
      error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
      success: false,
    })
  })
})
