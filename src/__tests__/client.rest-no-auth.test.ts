import { beforeEach, describe, expect, it, vi } from 'vitest'

import HundredXClient from 'src'
import { privateKey, productsData, klines } from 'vitest/utils'

describe('The HundredXClient REST', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    vi.setSystemTime(1709829760000)
  })

  describe('product endpoints', () => {
    it('should allow a user to get a list of products', async () => {
      fetchMock.mockResponse(JSON.stringify(productsData))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getProducts()

      expect(fetchMock.mock.calls[0][0]).toEqual(expect.stringContaining('/products'))
      expect(result).toMatchInlineSnapshot(`
        {
          "products": [
            {
              "active": true,
              "baseAsset": "WBTC",
              "baseAssetAddress": "0xdc2f16a474a969056e6a559629b46d01f8675a1a",
              "id": 1003,
              "increment": "100000000000000",
              "initialLongWeight": "900000000000000000",
              "initialShortWeight": "1100000000000000000",
              "isMakerRebate": true,
              "maintenanceLongWeight": "950000000000000000",
              "maintenanceShortWeight": "1050000000000000000",
              "makerFee": "300000000000000",
              "markPrice": "72581488537710140836821",
              "maxQuantity": "1000000000000000000000000",
              "minQuantity": "1000000000000000",
              "quoteAsset": "USDB",
              "quoteAssetAddress": "0x79a59c326c715ac2d31c169c85d1232319e341ce",
              "symbol": "btcperp",
              "takerFee": "500000000000000",
              "type": "PERP",
            },
            {
              "active": true,
              "baseAsset": "WETH",
              "baseAssetAddress": "0x4200000000000000000000000000000000000023",
              "id": 1002,
              "increment": "10000000000000",
              "initialLongWeight": "950000000000000000",
              "initialShortWeight": "1050000000000000000",
              "isMakerRebate": true,
              "maintenanceLongWeight": "970000000000000000",
              "maintenanceShortWeight": "1030000000000000000",
              "makerFee": "50000000000000",
              "markPrice": "3399999999999999999772",
              "maxQuantity": "100000000000000000000000",
              "minQuantity": "100000000000000",
              "quoteAsset": "USDB",
              "quoteAssetAddress": "0x79a59c326c715ac2d31c169c85d1232319e341ce",
              "symbol": "ethperp",
              "takerFee": "200000000000000",
              "type": "PERP",
            },
          ],
        }
      `)
    })

    it('should handle an unknown error getting products', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getProducts()

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        products: [],
      })
    })

    it('should allow a user to get a specific product by its id', async () => {
      fetchMock.mockResponse(JSON.stringify(productsData[0]))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getProduct(1003)

      expect(fetchMock.mock.calls[0][0]).toEqual(
        expect.stringContaining('/products/product-by-id/1003'),
      )
      expect(result).toMatchInlineSnapshot(`
        {
          "product": {
            "active": true,
            "baseAsset": "WBTC",
            "baseAssetAddress": "0xdc2f16a474a969056e6a559629b46d01f8675a1a",
            "id": 1003,
            "increment": "100000000000000",
            "initialLongWeight": "900000000000000000",
            "initialShortWeight": "1100000000000000000",
            "isMakerRebate": true,
            "maintenanceLongWeight": "950000000000000000",
            "maintenanceShortWeight": "1050000000000000000",
            "makerFee": "300000000000000",
            "markPrice": "72581488537710140836821",
            "maxQuantity": "1000000000000000000000000",
            "minQuantity": "1000000000000000",
            "quoteAsset": "USDB",
            "quoteAssetAddress": "0x79a59c326c715ac2d31c169c85d1232319e341ce",
            "symbol": "btcperp",
            "takerFee": "500000000000000",
            "type": "PERP",
          },
        }
      `)
    })

    it('should allow a user to get a specific product by its symbol', async () => {
      fetchMock.mockResponse(JSON.stringify(productsData[1]))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getProduct('ethperp')

      expect(fetchMock.mock.calls[0][0]).toEqual(expect.stringContaining('/products/ethperp'))
      expect(result).toMatchInlineSnapshot(`
        {
          "product": {
            "active": true,
            "baseAsset": "WETH",
            "baseAssetAddress": "0x4200000000000000000000000000000000000023",
            "id": 1002,
            "increment": "10000000000000",
            "initialLongWeight": "950000000000000000",
            "initialShortWeight": "1050000000000000000",
            "isMakerRebate": true,
            "maintenanceLongWeight": "970000000000000000",
            "maintenanceShortWeight": "1030000000000000000",
            "makerFee": "50000000000000",
            "markPrice": "3399999999999999999772",
            "maxQuantity": "100000000000000000000000",
            "minQuantity": "100000000000000",
            "quoteAsset": "USDB",
            "quoteAssetAddress": "0x79a59c326c715ac2d31c169c85d1232319e341ce",
            "symbol": "ethperp",
            "takerFee": "200000000000000",
            "type": "PERP",
          },
        }
      `)
    })

    it('should handle an unknown error', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getProduct(1003)

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        product: {},
      })
    })
  })

  describe('server time endpoint', () => {
    it('should allow a user to get the server time', async () => {
      fetchMock.mockResponse(JSON.stringify({ serverTime: 1709829760000 }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getServerTime()

      expect(fetchMock.mock.calls[0][0]).toEqual(expect.stringContaining('/time'))
      expect(result).toMatchInlineSnapshot(`
        {
          "serverTime": 1709829760000,
        }
      `)
    })

    it('should handle an unknown error', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getServerTime()

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
      })
    })
  })

  describe('kline endpoint', () => {
    it('should allow a user to get kline data with no optional args', async () => {
      fetchMock.mockResponse(JSON.stringify(klines))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getKlines('ethperp')

      expect(fetchMock.mock.calls[0][0]).toMatch(/.+\/uiKlines\?symbol=ethperp$/)
      expect(result).toMatchInlineSnapshot(`
        {
          "klines": [
            {
              "E": 1710349200031,
              "c": "4000000000000000000000",
              "e": "klines_",
              "h": "4000000000000000000000",
              "i": "1h",
              "l": "4000000000000000000000",
              "o": "4000000000000000000000",
              "s": "ethperp",
              "v": "0",
              "x": true,
            },
            {
              "E": 1710352800031,
              "c": "3985200000000000000000",
              "e": "klines_",
              "h": "3989000000000000000000",
              "i": "1h",
              "l": "3983700000000000000000",
              "o": "0",
              "s": "ethperp",
              "v": "5940000000000000000",
              "x": true,
            },
            {
              "E": 1710356400031,
              "c": "3977300000000000000000",
              "e": "klines_",
              "h": "4005000000000000000000",
              "i": "1h",
              "l": "3962700000000000000000",
              "o": "3985200000000000000000",
              "s": "ethperp",
              "v": "66960000000000000000",
              "x": true,
            },
            {
              "E": 1710360000031,
              "c": "3994800000000000000000",
              "e": "klines_",
              "h": "4005400000000000000000",
              "i": "1h",
              "l": "3976000000000000000000",
              "o": "3977300000000000000000",
              "s": "ethperp",
              "v": "4850000000000000000",
              "x": true,
            },
            {
              "E": 1710363600031,
              "c": "3993800000000000000000",
              "e": "klines_",
              "h": "4007700000000000000000",
              "i": "1h",
              "l": "3988600000000000000000",
              "o": "3994800000000000000000",
              "s": "ethperp",
              "v": "3320000000000000000",
              "x": true,
            },
          ],
        }
      `)
    })

    it('should allow a user to get kline data with optional args passed', async () => {
      fetchMock.mockResponse(JSON.stringify(klines))

      const Client = new HundredXClient(privateKey)

      await Client.getKlines('ethperp', {
        endTime: Date.now(),
        interval: '4h',
        limit: 1000,
        startTime: Date.now() - 72000000,
      })

      expect(fetchMock.mock.calls[0][0]).toMatch(
        /.+\/uiKlines\?symbol=ethperp&endTime=1709829760000&interval=4h&limit=1000&startTime=1709757760000$/,
      )
    })

    it('should allow the end and start time to be now', async () => {
      fetchMock.mockResponse(JSON.stringify(klines))

      const Client = new HundredXClient(privateKey)

      await Client.getKlines('ethperp', { endTime: Date.now(), startTime: Date.now() })

      expect(fetchMock.mock.calls[0][0]).toMatch(
        /.+\/uiKlines\?symbol=ethperp&endTime=1709829760000&startTime=1709829760000$/,
      )
    })

    it('should not allow a limit over 1000', async () => {
      const Client = new HundredXClient(privateKey)

      const result = await Client.getKlines('ethperp', { limit: 1001 })

      expect(result).toEqual({
        error: { message: 'Limit must be between 0 and 1000.' },
        klines: [],
      })
    })

    it('should not allow a limit of less than or equal to 0', async () => {
      const Client = new HundredXClient(privateKey)

      const result = await Client.getKlines('ethperp', { limit: 0 })

      expect(result).toEqual({
        error: { message: 'Limit must be between 0 and 1000.' },
        klines: [],
      })
    })

    it('should not allow the start time to be in the future', async () => {
      const Client = new HundredXClient(privateKey)

      const result = await Client.getKlines('ethperp', { startTime: Date.now() + 1 })

      expect(result).toEqual({
        error: { message: 'Start time cannot be in the future.' },
        klines: [],
      })
    })

    it('should not allow the start time to exceed the end time', async () => {
      const Client = new HundredXClient(privateKey)

      const result = await Client.getKlines('ethperp', {
        endTime: Date.now(),
        startTime: Date.now() + 1,
      })

      expect(result).toEqual({
        error: { message: 'Start time cannot be after end time.' },
        klines: [],
      })
    })

    it('should handle an unknown error', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getKlines('ethperp')

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        klines: [],
      })
    })
  })
})
