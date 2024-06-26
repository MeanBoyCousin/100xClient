import { beforeEach, describe, expect, it, vi } from 'vitest'

import HundredXClient from 'src'
import { Interval } from 'src/enums'
import {
  klines,
  privateKey,
  productsData,
  tickers,
  ethOrderBook,
  mockTradeHistory,
} from 'vitest/utils'

describe('The HundredXClient REST', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    vi.useFakeTimers()
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
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
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
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
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
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
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
        interval: Interval['4H'],
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
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
        klines: [],
      })
    })
  })

  describe('ticker endpoint', () => {
    it('should allow a user to get data for all tickers', async () => {
      fetchMock.mockResponse(JSON.stringify(tickers))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getTickers()

      expect(fetchMock.mock.calls[0][0]).toMatch(/.+\/ticker\/24hr$/)
      expect(result).toMatchInlineSnapshot(`
        {
          "tickers": {
            "btcperp": {
              "fundingRateHourly": "-10848157239100",
              "fundingRateYearly": "-95094946357950600",
              "high": "75113700000000000000000",
              "low": "0",
              "markPrice": "70806062729901863024587",
              "nextFundingTime": 1712667600,
              "openInterest": "229411643244882036199661",
              "oraclePrice": "70816037672632469474700",
              "priceChange": "75113700000000000000000",
              "priceChangePercent": "0",
              "productId": 1003,
              "productSymbol": "btcperp",
              "volume": "96050000000000000000",
            },
            "ethperp": {
              "fundingRateHourly": "-499999999999999900",
              "fundingRateYearly": "-4382999999999999123400",
              "high": "10000000000000000000000000",
              "low": "0",
              "markPrice": "3378124999999999999818",
              "nextFundingTime": 1712667600,
              "openInterest": "433926912499999999976621",
              "oraclePrice": "3633138612183610451397",
              "priceChange": "10000000000000000000000000",
              "priceChangePercent": "0",
              "productId": 1002,
              "productSymbol": "ethperp",
              "volume": "3621652000000000000000",
            },
          },
        }
      `)
    })

    it('should allow a user to get data for a specific product', async () => {
      fetchMock.mockResponse(JSON.stringify([tickers[0]]))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getTickers('ethperp')

      expect(fetchMock.mock.calls[0][0]).toMatch(/.+\/ticker\/24hr\?symbol=ethperp$/)
      expect(result).toMatchInlineSnapshot(`
        {
          "tickers": {
            "ethperp": {
              "fundingRateHourly": "-499999999999999900",
              "fundingRateYearly": "-4382999999999999123400",
              "high": "10000000000000000000000000",
              "low": "0",
              "markPrice": "3378124999999999999818",
              "nextFundingTime": 1712667600,
              "openInterest": "433926912499999999976621",
              "oraclePrice": "3633138612183610451397",
              "priceChange": "10000000000000000000000000",
              "priceChangePercent": "0",
              "productId": 1002,
              "productSymbol": "ethperp",
              "volume": "3621652000000000000000",
            },
          },
        }
      `)
    })

    it('should handle an unknown error', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getTickers('ethperp')

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
        tickers: {},
      })
    })
  })

  describe('order book depth endpoint', () => {
    it('should return the order book depth with just a symbol', async () => {
      fetchMock.mockResponse(JSON.stringify(ethOrderBook))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getOrderBook('ethperp')

      expect(fetchMock.mock.calls[0][0]).toMatch(
        /.+\/depth\?symbol=ethperp&limit=5&granularity=10$/,
      )
      expect(result).toMatchInlineSnapshot(`
        {
          "asks": [
            [
              "3810200000000000000000",
              "2410000000000000000",
              "2410000000000000000",
            ],
            [
              "3819800000000000000000",
              "2970000000000000000",
              "5380000000000000000",
            ],
            [
              "3820500000000000000000",
              "1880000000000000000",
              "7260000000000000000",
            ],
            [
              "3821500000000000000000",
              "140000000000000000",
              "7400000000000000000",
            ],
            [
              "3821800000000000000000",
              "4080000000000000000",
              "11480000000000000000",
            ],
            [
              "3822100000000000000000",
              "2060000000000000000",
              "13540000000000000000",
            ],
            [
              "3824600000000000000000",
              "540000000000000000",
              "14080000000000000000",
            ],
            [
              "3824900000000000000000",
              "2430000000000000000",
              "16510000000000000000",
            ],
            [
              "3827100000000000000000",
              "3920000000000000000",
              "20430000000000000000",
            ],
            [
              "3828700000000000000000",
              "1580000000000000000",
              "22010000000000000000",
            ],
          ],
          "bids": [
            [
              "3801000000000000000000",
              "2850000000000000000",
              "2850000000000000000",
            ],
            [
              "3800000000000000000000",
              "1340000000000000000",
              "4190000000000000000",
            ],
            [
              "3796400000000000000000",
              "3630000000000000000",
              "7820000000000000000",
            ],
            [
              "3796200000000000000000",
              "2820000000000000000",
              "10640000000000000000",
            ],
            [
              "3795700000000000000000",
              "1160000000000000000",
              "11800000000000000000",
            ],
            [
              "3794300000000000000000",
              "780000000000000000",
              "12580000000000000000",
            ],
            [
              "3794000000000000000000",
              "1860000000000000000",
              "14440000000000000000",
            ],
            [
              "3793800000000000000000",
              "610000000000000000",
              "15050000000000000000",
            ],
            [
              "3793200000000000000000",
              "2100000000000000000",
              "17150000000000000000",
            ],
            [
              "3792200000000000000000",
              "200000000000000000",
              "17350000000000000000",
            ],
          ],
        }
      `)
    })

    it('should return the order book depth with all optional args passed', async () => {
      fetchMock.mockResponse(JSON.stringify(ethOrderBook))

      const Client = new HundredXClient(privateKey)

      await Client.getOrderBook('ethperp', 20, 18)

      expect(fetchMock.mock.calls[0][0]).toMatch(
        /.+\/depth\?symbol=ethperp&limit=20&granularity=18$/,
      )
    })

    it('should handle an unknown error', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getOrderBook('ethperp')

      expect(result).toEqual({
        asks: [],
        bids: [],
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
      })
    })
  })

  describe('calculate margin requirement endpoint', () => {
    it('should allow a user to successfully cancel an order', async () => {
      fetchMock.mockResponse(
        JSON.stringify({
          error: '',
          success: true,
          value: '17449331829095744143007',
        }),
      )

      const Client = new HundredXClient(privateKey)

      const result = await Client.calculateMarginRequirement(true, 3000, 1002, 10)

      expect(fetchMock.mock.calls[0][0]).toMatch(
        /.+\/new-order-margin\?isBuy=true&price=3000000000000000000000&productId=1002&quantity=10000000000000000000$/,
      )
      expect(result).toEqual({ required: '17449331829095744143007' })
    })

    it('should handle an error during the cancel process', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'A known error occurred', success: false }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.calculateMarginRequirement(true, 3000, 1002, 10)

      expect(result).toEqual({
        error: {
          message: 'A known error occurred',
        },
        required: 0n,
      })
    })

    it('should handle an unknown error', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.calculateMarginRequirement(true, 3000, 1002, 10)

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
        required: 0n,
      })
    })
  })

  describe('trade history endpoint', () => {
    it('should return trade history with just a symbol', async () => {
      fetchMock.mockResponse(JSON.stringify(mockTradeHistory))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getTradeHistory('ethperp')

      expect(fetchMock.mock.calls[0][0]).toMatch(
        /.+\/trade-history\?symbol=ethperp&lookback=10&account=0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8&subAccountId=1$/,
      )
      expect(result).toMatchInlineSnapshot(`
        {
          "trades": [
            {
              "createdAt": 1719304034692,
              "makerAccount": "0x6efff71013eeb8ab151e847664f2b76fdbf096cd",
              "makerFees": "0",
              "makerID": "0x0b78249df1ef346cece15763c3c88232702c88505a850de236a847f0c33f16a6",
              "makerSubaccountId": 0,
              "price": "3356500000000000000000",
              "quantity": "3890600000000000000",
              "takerAccount": "0xb571978d4348ccb9950fe1963c81258d489de5ab",
              "takerFees": "1305879890000000000",
              "takerID": "0x5840b28f86da670fed0f76dcfee90dd7937d1c98669848ddf7ebdf8731d703f4",
              "takerIsBuyer": true,
              "takerSubaccountId": 0,
              "uid": "a77fc690-a9a3-41ec-b457-afced3b87e39",
            },
            {
              "createdAt": 1719304027570,
              "makerAccount": "0x6efff71013eeb8ab151e847664f2b76fdbf096cd",
              "makerFees": "0",
              "makerID": "0x0b78249df1ef346cece15763c3c88232702c88505a850de236a847f0c33f16a6",
              "makerSubaccountId": 0,
              "price": "3356500000000000000000",
              "quantity": "109400000000000000",
              "takerAccount": "0xb4220fb0104dab7b818200094fd6e5e8eee91f8b",
              "takerFees": "36720110000000000",
              "takerID": "0xaf88e3fb829d1e8e223936c7b7a52c56979adb0367ee1133b308c98068db97b0",
              "takerIsBuyer": true,
              "takerSubaccountId": 0,
              "uid": "14c46043-3b16-492a-ac42-9cdc459fad0c",
            },
            {
              "createdAt": 1719296533167,
              "makerAccount": "0x6efff71013eeb8ab151e847664f2b76fdbf096cd",
              "makerFees": "0",
              "makerID": "0xf9ef7a387966e73152eb91779437a730d9ed49af0b25fec855782803dbbb2ac0",
              "makerSubaccountId": 0,
              "price": "3370000000000000000000",
              "quantity": "2228000000000000000",
              "takerAccount": "0xb571978d4348ccb9950fe1963c81258d489de5ab",
              "takerFees": "750836000000000000",
              "takerID": "0x9e967c752ee9df26388e7dfd736820a2f82fdbc82cb8820de09de070ec8ea350",
              "takerIsBuyer": false,
              "takerSubaccountId": 0,
              "uid": "8bb39aa9-3c00-411b-bbd8-613eb14b4721",
            },
          ],
        }
      `)
    })

    it('should return trade history with optional args passed', async () => {
      fetchMock.mockResponse(JSON.stringify(mockTradeHistory))

      const Client = new HundredXClient(privateKey)

      await Client.getTradeHistory('ethperp', 1)

      expect(fetchMock.mock.calls[0][0]).toMatch(
        /.+\/trade-history\?symbol=ethperp&lookback=1&account=0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8&subAccountId=1$/,
      )
    })

    it('should return an empty array for trades if trades are null', async () => {
      fetchMock.mockResponse(JSON.stringify({ success: true, trades: null }))

      const Client = new HundredXClient(privateKey)

      const response = await Client.getTradeHistory('ethperp')

      expect(response).toMatchInlineSnapshot(`
        {
          "trades": [],
        }
      `)
    })

    it('should handle a known error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'A known error occurred', success: false }))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getTradeHistory('ethperp')

      expect(result).toEqual({
        error: {
          message: 'A known error occurred',
        },
        trades: [],
      })
    })

    it('should handle an unknown error', async () => {
      fetchMock.mockReject(new Error('An unknown error occurred'))

      const Client = new HundredXClient(privateKey)

      const result = await Client.getTradeHistory('ethperp')

      expect(result).toEqual({
        error: { message: 'An unknown error occurred. Try enabling debug mode for mode detail.' },
        trades: [],
      })
    })
  })
})
