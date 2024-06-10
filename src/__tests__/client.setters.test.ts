import { beforeEach, describe, expect, it } from 'vitest'

import HundredXClient from 'src'
import { privateKey } from 'vitest/utils'

describe('The HundredXClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should allow the sub-account to be changed', async () => {
    const Client = new HundredXClient(privateKey)

    await Client.placeOrder({
      isBuy: true,
      price: 3450,
      priceIncrement: 100000000000000000n,
      productId: 1002,
      quantity: 0.001,
    })
    const firstSubAccountId = JSON.parse(fetchMock.mock.calls[0][1]?.body as string).subAccountId

    expect(Client.subAccountId).toEqual(1)
    expect(firstSubAccountId).toEqual(1)

    Client.setSubAccountId = 2

    await Client.placeOrder({
      isBuy: true,
      price: 3450,
      priceIncrement: 100000000000000000n,
      productId: 1002,
      quantity: 0.001,
    })
    const secondSubAccountId = JSON.parse(fetchMock.mock.calls[1][1]?.body as string).subAccountId

    expect(Client.subAccountId).toEqual(2)
    expect(secondSubAccountId).toEqual(2)
  })
})
