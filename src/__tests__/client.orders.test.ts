import { recoverTypedDataAddress } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HundredXClient from 'src'
import EIP712 from 'src/ABI/EIP712'
import { TimeInForce, OrderType } from 'src/enums'
import { privateKey, address, marketFOKOrder, customOrder } from 'vitest/utils'

describe('The HundredXClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
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
            expiration: 1712421760000n,
            nonce: 1709829760000n,
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
          "https://api.ciaobella.dev/v1/order",
          {
            "body": "{"expiration":1712421760000,"nonce":1709829760000,"price":"3450000000000000000000","quantity":"1000000000000000","signature":"0x621f5d42c060b3ac96416665df5b1f5e43b3db89465f1863cff6b9078a5a4b9243335a7522c75ff8004885c590ad334cf5933d1101cfdfe7e69f5a4e94d416de1c","account":"0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8","isBuy":true,"orderType":2,"productId":1002,"subAccountId":1,"timeInForce":1}",
            "method": "POST",
          },
        ]
      `)
      expect(result).toEqual({
        order: {
          account: address,
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
          sender: address,
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
          "https://api.ciaobella.dev/v1/order",
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
    it('should allow a user to successfully place multiple orders that are both successfully and throw errors', async () => {
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
            account: address,
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
            sender: address,
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
})
