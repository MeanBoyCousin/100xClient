import { recoverTypedDataAddress } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HundredXClient from 'src'
import EIP712 from 'src/ABI/EIP712'
import { TimeInForce, OrderType } from 'src/enums'
import { privateKey, address, marketFOKOrder, customOrder, replacementOrder } from 'vitest/utils'

describe('The HundredXClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(1709829760000)
  })

  describe('placeOrder function', () => {
    it('should allow a user to successfully place a market order', async () => {
      fetchMock.mockResponse(JSON.stringify(marketFOKOrder))

      const Client = new HundredXClient(privateKey)

      const result = await Client.placeOrder({
        isBuy: true,
        price: 3450,
        priceIncrement: 100000000000000000n,
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
            expiration: 1712421760000n,
            nonce: 1709829760000000n,
            orderType: 2,
            price: 3536200000000000000000n,
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
            "body": "{"expiration":1712421760000,"nonce":1709829760000000,"price":"3536200000000000000000","quantity":"1000000000000000","signature":"0x8c78e174166913aeee11b427169e1a33ba6ecd06dbdccc1fd60da4e33b8ce0a01e17d420110bbb5bd07af7d8ae19b83a443cab3885f20a863d262014f3e1ce481b","account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","isBuy":true,"orderType":2,"productId":1002,"subAccountId":1,"timeInForce":1}",
            "method": "POST",
          },
        ]
      `)
      expect(result).toEqual({
        order: marketFOKOrder,
      })
    })

    it('should allow a user to successfully place an order with all args passed (limit order)', async () => {
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
            "body": "{"expiration":1800000000000,"nonce":123,"price":"3450000000000000000000","quantity":"1000000000000000","signature":"0x76ebeb862bc07200a55ebec586f1715acb88f77ae18865fd57cd34352471eeaf70082bcfe24200e0abef682fe1f96c9d1649f1156c6ae920ebe542e93316e9e61c","account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","isBuy":true,"orderType":0,"productId":1002,"subAccountId":1,"timeInForce":2}",
            "method": "POST",
          },
        ]
      `)
      expect(result).toEqual({
        order: customOrder,
      })
    })

    it('should allow a user to specify slippage', async () => {
      fetchMock.mockResponse(JSON.stringify(marketFOKOrder))

      const Client = new HundredXClient(privateKey)

      await Client.placeOrder({
        isBuy: true,
        price: 3450,
        priceIncrement: 100000000000000000n,
        productId: 1002,
        quantity: 0.001,
        slippage: 1,
      })
      await Client.placeOrder({
        isBuy: false,
        price: 3450,
        priceIncrement: 100000000000000000n,
        productId: 1002,
        quantity: 0.001,
        slippage: 1.25,
      })

      const buyPrice = JSON.parse(fetchMock.mock.calls[0][1]?.body as string).price
      const sellPrice = JSON.parse(fetchMock.mock.calls[1][1]?.body as string).price

      expect(buyPrice).toEqual('3484500000000000000000')
      expect(sellPrice).toEqual('3406800000000000000000')
    })

    it('should return an error for a market order with no priceIncrement', async () => {
      const Client = new HundredXClient(privateKey)

      const result = await Client.placeOrder({
        isBuy: true,
        price: 3450,
        productId: 1002,
        quantity: 0.001,
      })

      expect(result).toEqual({
        error: {
          message: 'A priceIncrement is required for market orders',
        },
        order: {},
      })
    })

    it('should handle an error during the order process', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'A known error occurred' }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.placeOrder({
        isBuy: true,
        price: 3450,
        priceIncrement: 100000000000000000n,
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
        priceIncrement: 100000000000000000n,
        productId: 1002,
        quantity: 0.001,
      })

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
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
          priceIncrement: 100000000000000000n,
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
          priceIncrement: 100000000000000000n,
          productId: 1002,
          quantity: 0.001,
        },
        {
          isBuy: true,
          price: 3450,
          priceIncrement: 100000000000000000n,
          productId: 1002,
          quantity: 0.001,
        },
      ])

      expect(result).toEqual([
        {
          order: marketFOKOrder,
        },
        {
          order: customOrder,
        },
        {
          error: {
            message: 'A priceIncrement is required for market orders',
          },
          order: {},
        },
        {
          error: {
            message: 'A known error occurred',
          },
          order: {},
        },
        {
          error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
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
            "body": "{"account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","orderId":"0x3505c6219b1f51cf216e432b153f8637c1fa9342520bd7c780bd80dafe0eed94","productId":1002,"subAccountId":1,"signature":"0x84e59cbf2142640295e93c68c0ec00757a26b6d3ada13a052abb29e9aa0d9f902834784f187c6a316d03b4bb15b535584ae2498407d14a17028185694b12139a1b"}",
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
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
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
          error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
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
            "body": "{"account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","productId":1002,"subAccountId":1,"signature":"0x2ad1ed1080d97172760ea6474dd1eb76742f5333f106e62219dbb64282964d9f395815055519ed4f37c2f55b475568240ac51eca27e077b3d8157c3c0da2c5961c"}",
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
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
        success: false,
      })
    })
  })

  describe('cancelAndReplaceOrder function', () => {
    it('should allow a user to cancel and replace an order', async () => {
      fetchMock.mockResponse(JSON.stringify(replacementOrder))

      const Client = new HundredXClient(privateKey)

      const result = await Client.cancelAndReplaceOrder(replacementOrder.id, {
        isBuy: true,
        price: 3455,
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
            expiration: 1712421760000n,
            nonce: 1709829760000000n,
            orderType: 1,
            price: 3455000000000000000000n,
            productId: 1002,
            quantity: 1000000000000000n,
            subAccountId: 1,
            timeInForce: 0,
          },
          primaryType: 'Order',
          signature: JSON.parse(call[1]?.body as string).newOrder.signature,
          types: EIP712,
        }),
      ).toEqual(address)
      expect(call).toMatchInlineSnapshot(`
        [
          "https://api.staging.100x.finance/v1/order/cancel-and-replace",
          {
            "body": "{"idToCancel":"0x08d4079c501e5fbb2153c7fe785ea4648ffcdac411d93511edcb5b18aecc158f","newOrder":{"expiration":1712421760000,"nonce":1709829760000000,"price":"3455000000000000000000","quantity":"1000000000000000","signature":"0x6438968d739df7ffade1aa28d03d0ebbd8c3297134402d02fdbcd9f69bdf1ee80525712e93012093329f0ac55226992a4699973de59ca687a91258054dbbc8d21c","account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","isBuy":true,"orderType":1,"productId":1002,"subAccountId":1,"timeInForce":0}}",
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
          orderType: 1,
          price: '3455000000000000000000',
          productId: 1002,
          productSymbol: 'ethperp',
          quantity: '1000000000000000',
          residualQuantity: '1000000000000000',
          sender: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
          signature:
            '0x099fd784840218f0df8cf557e6a42ba8d26f6c8588a22b69f34f6d3e2705714a1d3bb8238a0a21ff824b77920691a7e926a02b2d8ebe8accf62895027b8417fd1c',
          status: 'OPEN',
          subAccountId: 1,
          timeInForce: 0,
        },
      })
    })

    it('should allow a user to cancel and replace an order with all args passed', async () => {
      fetchMock.mockResponse(
        JSON.stringify({ ...replacementOrder, expiry: 1800000000000, nonce: 123 }),
      )

      const Client = new HundredXClient(privateKey)

      const result = await Client.cancelAndReplaceOrder(replacementOrder.id, {
        expiration: 1800000000000,
        isBuy: true,
        nonce: 123,
        price: 3455,
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
            expiration: 1800000000000n,
            nonce: 123n,
            orderType: 1,
            price: 3455000000000000000000n,
            productId: 1002,
            quantity: 1000000000000000n,
            subAccountId: 1,
            timeInForce: 0,
          },
          primaryType: 'Order',
          signature: JSON.parse(call[1]?.body as string).newOrder.signature,
          types: EIP712,
        }),
      ).toEqual(address)
      expect(call).toMatchInlineSnapshot(`
        [
          "https://api.staging.100x.finance/v1/order/cancel-and-replace",
          {
            "body": "{"idToCancel":"0x08d4079c501e5fbb2153c7fe785ea4648ffcdac411d93511edcb5b18aecc158f","newOrder":{"expiration":1800000000000,"nonce":123,"price":"3455000000000000000000","quantity":"1000000000000000","signature":"0xe2a84fbf510c19c1ce9b48e0b76f404a1d387751601bd50714a2e2a3ac81eddc5d7d4810a426a8ce34dc420c608faeb6ced75dbbd89ddf90ab72c8552779091f1c","account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","isBuy":true,"orderType":1,"productId":1002,"subAccountId":1,"timeInForce":0}}",
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
          orderType: 1,
          price: '3455000000000000000000',
          productId: 1002,
          productSymbol: 'ethperp',
          quantity: '1000000000000000',
          residualQuantity: '1000000000000000',
          sender: '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8',
          signature:
            '0x099fd784840218f0df8cf557e6a42ba8d26f6c8588a22b69f34f6d3e2705714a1d3bb8238a0a21ff824b77920691a7e926a02b2d8ebe8accf62895027b8417fd1c',
          status: 'OPEN',
          subAccountId: 1,
          timeInForce: 0,
        },
      })
    })

    it('should handle an error during the cancel process', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'A known error occurred', success: false }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.cancelAndReplaceOrder(replacementOrder.id, {
        isBuy: true,
        price: 3455,
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

      const result = await Client.cancelAndReplaceOrder(replacementOrder.id, {
        isBuy: true,
        price: 3455,
        productId: 1002,
        quantity: 0.001,
      })

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
        order: {},
      })
    })
  })
})
