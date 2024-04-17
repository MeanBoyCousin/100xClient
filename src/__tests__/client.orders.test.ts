import { recoverTypedDataAddress } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HundredXClient from 'src'
import EIP712 from 'src/ABI/EIP712'
import { TimeInForce, OrderType } from 'src/enums'
import { privateKey, address, marketFOKOrder, customOrder } from 'vitest/utils'

describe('The HundredXClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(1709829760000)
  })

  describe('placeOrder function', () => {
    it('should allow a user to successfully place an order', async () => {
      fetchMock.mockResponse(JSON.stringify(marketFOKOrder))

      const Client = new HundredXClient(privateKey)

      const result = await Client.placeOrder({
        isBuy: true,
        price: 3450,
        productId: 1002,
        quantity: 0.001,
      })
      const call = fetchMock.mock.calls[0]

      expect(
        await recoverTypedDataAddress({
          domain: Client.domain,
          message: {
            account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
            isBuy: true,
            expiration: 17098300192000000n,
            nonce: 17098297600000000n,
            orderType: 2,
            price: 3450000000000000000000n,
            productId: 1002,
            quantity: 1000000000000000n,
            subAccountId: 1,
            timeInForce: 1,
          },
          primaryType: 'Order',
          signature: JSON.parse(call[1]?.body as string).signature,
          types: EIP712,
        }),
      ).toEqual(address)
      expect(call).toMatchInlineSnapshot(`
        [
          "https://api.staging.100x.finance/v1/order",
          {
            "body": "{"expiration":17098300192000000,"nonce":17098297600000000,"price":"3450000000000000000000","quantity":"1000000000000000","signature":"0xefc956696ae87d1078a2f2a007fa762955489d5eec454b76f80ac41b17ab6f084416bdff779f8e904824dd000544c0335062cd4e429e6683e64173be4c389a9e1c","account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","isBuy":true,"orderType":2,"productId":1002,"subAccountId":1,"timeInForce":1}",
            "method": "POST",
          },
        ]
      `)
      expect(result).toEqual({
        order: {
          account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
          createdAt: 1712829961877,
          expiry: 1712421760000,
          id: '0x08d4079c501e5fbb2153c7fe785ea4648ffcdac411d93511edcb5b18aecc158f',
          isBuy: true,
          nonce: 1712421760000,
          orderType: 2,
          price: '3450000000000000000000',
          productId: 1002,
          productSymbol: 'ethperp',
          quantity: '1000000000000000',
          residualQuantity: '0',
          sender: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
          signature:
            '0x4e6a845046760ac9007f8ecf2e632dcc40cfd4fee6239fd7242f2c0e46a02d4b3a8dc8aa26298138c2f137a402e81f267a462edb4ab2dca0534b99179dc787da1c',
          status: 'FILLED',
          subAccountId: 1,
          timeInForce: 1,
        },
      })
    })

    it('should allow a user to successfully place an order with all args passed', async () => {
      fetchMock.mockResponse(JSON.stringify(customOrder))

      const Client = new HundredXClient(privateKey)

      const result = await Client.placeOrder({
        expiration: 1800000000000,
        isBuy: true,
        nonce: 123,
        orderType: OrderType.LIMIT,
        price: 3450,
        productId: 1002,
        quantity: 0.001,
        timeInForce: TimeInForce.IOC,
      })
      const call = fetchMock.mock.calls[0]

      expect(
        await recoverTypedDataAddress({
          domain: Client.domain,
          message: {
            account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
            isBuy: true,
            expiration: 1800000000000n,
            nonce: 123n,
            orderType: 0,
            price: 3450000000000000000000n,
            productId: 1002,
            quantity: 1000000000000000n,
            subAccountId: 1,
            timeInForce: 2,
          },
          primaryType: 'Order',
          signature: JSON.parse(call[1]?.body as string).signature,
          types: EIP712,
        }),
      ).toEqual(address)
      expect(call).toMatchInlineSnapshot(`
        [
          "https://api.staging.100x.finance/v1/order",
          {
            "body": "{"expiration":1800000000000,"nonce":123,"price":"3450000000000000000000","quantity":"1000000000000000","signature":"0x1c434d24e714578f6f1966b0adf9cfbe574381c0c9d49b6d2c454e2db7b3825944e22d72d44acdc3aeec2d4b6642e73eb89c42b7582a568ce46b7f21859a38811b","account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","isBuy":true,"orderType":0,"productId":1002,"subAccountId":1,"timeInForce":2}",
            "method": "POST",
          },
        ]
      `)
      expect(result).toEqual({
        order: {
          account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
          createdAt: 1712829961877,
          expiry: 1800000000000,
          id: '0x08d4079c501e5fbb2153c7fe785ea4648ffcdac411d93511edcb5b18aecc158f',
          isBuy: true,
          nonce: 123,
          orderType: 0,
          price: '3450000000000000000000',
          productId: 1002,
          productSymbol: 'ethperp',
          quantity: '1000000000000000',
          residualQuantity: '0',
          sender: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
          signature:
            '0x4e6a845046760ac9007f8ecf2e632dcc40cfd4fee6239fd7242f2c0e46a02d4b3a8dc8aa26298138c2f137a402e81f267a462edb4ab2dca0534b99179dc787da1c',
          status: 'FILLED',
          subAccountId: 1,
          timeInForce: 2,
        },
      })
    })

    it('should handle an error during the order process', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'A known error occurred' }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.placeOrder({
        isBuy: true,
        price: 3450,
        productId: 1002,
        quantity: 0.001,
      })

      expect(result).toEqual({
        error: {
          message: 'A known error occurred',
        },
        order: {},
      })
    })

    it('should handle an unknown error', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.placeOrder({
        isBuy: true,
        price: 3450,
        productId: 1002,
        quantity: 0.001,
      })

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        order: {},
      })
    })
  })

  describe('placeOrders function', () => {
    it('should allow a user to place multiple orders that are both successful and throw errors', async () => {
      fetchMock
        .mockOnce(JSON.stringify(marketFOKOrder))
        .mockOnce(JSON.stringify(customOrder))
        .mockOnce(JSON.stringify({ error: 'A known error occurred' }))
        .mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.placeOrders([
        {
          isBuy: true,
          price: 3450,
          productId: 1002,
          quantity: 0.001,
        },
        {
          expiration: 1800000000000,
          isBuy: true,
          nonce: 123,
          orderType: OrderType.LIMIT,
          price: 3450,
          productId: 1002,
          quantity: 0.001,
          timeInForce: TimeInForce.IOC,
        },
        {
          isBuy: true,
          price: 3450,
          productId: 1002,
          quantity: 0.001,
        },
        {
          isBuy: true,
          price: 3450,
          productId: 1002,
          quantity: 0.001,
        },
      ])

      expect(result).toEqual([
        {
          order: {
            account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
            createdAt: 1712829961877,
            expiry: 1712421760000,
            id: '0x08d4079c501e5fbb2153c7fe785ea4648ffcdac411d93511edcb5b18aecc158f',
            isBuy: true,
            nonce: 1712421760000,
            orderType: 2,
            price: '3450000000000000000000',
            productId: 1002,
            productSymbol: 'ethperp',
            quantity: '1000000000000000',
            residualQuantity: '0',
            sender: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
            signature:
              '0x4e6a845046760ac9007f8ecf2e632dcc40cfd4fee6239fd7242f2c0e46a02d4b3a8dc8aa26298138c2f137a402e81f267a462edb4ab2dca0534b99179dc787da1c',
            status: 'FILLED',
            subAccountId: 1,
            timeInForce: 1,
          },
        },
        {
          order: {
            account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
            createdAt: 1712829961877,
            expiry: 1800000000000,
            id: '0x08d4079c501e5fbb2153c7fe785ea4648ffcdac411d93511edcb5b18aecc158f',
            isBuy: true,
            nonce: 123,
            orderType: 0,
            price: '3450000000000000000000',
            productId: 1002,
            productSymbol: 'ethperp',
            quantity: '1000000000000000',
            residualQuantity: '0',
            sender: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
            signature:
              '0x4e6a845046760ac9007f8ecf2e632dcc40cfd4fee6239fd7242f2c0e46a02d4b3a8dc8aa26298138c2f137a402e81f267a462edb4ab2dca0534b99179dc787da1c',
            status: 'FILLED',
            subAccountId: 1,
            timeInForce: 2,
          },
        },
        {
          error: {
            message: 'A known error occurred',
          },
          order: {},
        },
        {
          error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
          order: {},
        },
      ])
    })
  })

  describe('cancelOrder function', () => {
    it('should allow a user to successfully cancel an order', async () => {
      fetchMock.mockResponse(JSON.stringify({ success: true }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.cancelOrder(
        '0x3505c6219b1f51cf216e432b153f8637c1fa9342520bd7c780bd80dafe0eed94',
        1002,
      )
      const call = fetchMock.mock.calls[0]

      expect(
        await recoverTypedDataAddress({
          domain: Client.domain,
          message: {
            account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
            orderId: '0x3505c6219b1f51cf216e432b153f8637c1fa9342520bd7c780bd80dafe0eed94',
            productId: 1002,
            subAccountId: 1,
          },
          primaryType: 'CancelOrder',
          signature: JSON.parse(call[1]?.body as string).signature,
          types: EIP712,
        }),
      ).toEqual(address)
      expect(call).toMatchInlineSnapshot(`
        [
          "https://api.staging.100x.finance/v1/order",
          {
            "body": "{"account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","orderId":"0x3505c6219b1f51cf216e432b153f8637c1fa9342520bd7c780bd80dafe0eed94","productId":1002,"subAccountId":1,"signature":"0x398240c7e0542ab55b4a49ea8ad11808938365923bd7e8fc42c8d101f121c228057b6e234bfc3e330432ab0a87a21d7704d790e4611f9f6069d1929eb0071a031b"}",
            "method": "DELETE",
          },
        ]
      `)
      expect(result).toEqual({ success: true })
    })

    it('should handle an error during the cancel process', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'A known error occurred', success: false }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.cancelOrder(
        '0x3505c6219b1f51cf216e432b153f8637c1fa9342520bd7c780bd80dafe0eed94',
        1002,
      )

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

      const result = await Client.cancelOrder(
        '0x3505c6219b1f51cf216e432b153f8637c1fa9342520bd7c780bd80dafe0eed94',
        1002,
      )

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        success: false,
      })
    })
  })

  describe('cancelOrders function', () => {
    it('should allow a user to cancel multiple orders that are both successful and throw errors', async () => {
      fetchMock
        .mockOnce(JSON.stringify({ success: true }))
        .mockOnce(JSON.stringify({ error: 'A known error occurred', success: false }))
        .mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.cancelOrders([
        ['0x3505c6219b1f51cf216e432b153f8637c1fa9342520bd7c780bd80dafe0eed94', 1002],
        ['0x3505c6219b1f51cf216e432b153f8637c1fa9342520bd7c780bd80dafe0eed94', 1002],
        ['0x3505c6219b1f51cf216e432b153f8637c1fa9342520bd7c780bd80dafe0eed94', 1002],
      ])

      expect(result).toEqual([
        {
          success: true,
        },
        {
          error: {
            message: 'A known error occurred',
          },
          success: false,
        },
        {
          error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
          success: false,
        },
      ])
    })
  })

  describe('cancelOpenOrdersForProduct function', () => {
    it('should allow a user to successfully cancel all orders for a product', async () => {
      fetchMock.mockResponse(JSON.stringify({ success: true }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.cancelOpenOrdersForProduct(1002)
      const call = fetchMock.mock.calls[0]

      expect(
        await recoverTypedDataAddress({
          domain: Client.domain,
          message: {
            account: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
            productId: 1002,
            subAccountId: 1,
          },
          primaryType: 'CancelOrders',
          signature: JSON.parse(call[1]?.body as string).signature,
          types: EIP712,
        }),
      ).toEqual(address)
      expect(call).toMatchInlineSnapshot(`
        [
          "https://api.staging.100x.finance/v1/openOrders",
          {
            "body": "{"account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","productId":1002,"subAccountId":1,"signature":"0x1a33343cdbbf084b254929943d818903e4ee8cd7be6f15bd42ad8938c4a2279561ab5dc19998163196b7963d10b30f2fce9d47968050cbc2bfb4bbafd184276a1c"}",
            "method": "DELETE",
          },
        ]
      `)
      expect(result).toEqual({ success: true })
    })

    it('should handle an error during the cancel process', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'A known error occurred', success: false }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.cancelOpenOrdersForProduct(1002)

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

      const result = await Client.cancelOpenOrdersForProduct(1002)

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        success: false,
      })
    })
  })
})
