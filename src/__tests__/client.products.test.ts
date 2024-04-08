import { beforeEach, describe, expect, it } from 'vitest'

import HundredXClient from 'src'
import { privateKey } from 'vitest/utils'

const productsData = [
  {
    id: 1003,
    type: 'PERP',
    symbol: 'btcperp',
    active: true,
    baseAsset: 'WBTC',
    quoteAsset: 'USDB',
    minQuantity: '1000000000000000',
    maxQuantity: '1000000000000000000000000',
    increment: '100000000000000',
    takerFee: '500000000000000',
    makerFee: '300000000000000',
    isMakerRebate: true,
    initialLongWeight: '900000000000000000',
    initialShortWeight: '1100000000000000000',
    maintenanceLongWeight: '950000000000000000',
    maintenanceShortWeight: '1050000000000000000',
    baseAssetAddress: '0xdc2f16a474a969056e6a559629b46d01f8675a1a',
    quoteAssetAddress: '0x79a59c326c715ac2d31c169c85d1232319e341ce',
    markPrice: '72581488537710140836821',
  },
  {
    id: 1002,
    type: 'PERP',
    symbol: 'ethperp',
    active: true,
    baseAsset: 'WETH',
    quoteAsset: 'USDB',
    minQuantity: '100000000000000',
    maxQuantity: '100000000000000000000000',
    increment: '10000000000000',
    takerFee: '200000000000000',
    makerFee: '50000000000000',
    isMakerRebate: true,
    initialLongWeight: '950000000000000000',
    initialShortWeight: '1050000000000000000',
    maintenanceLongWeight: '970000000000000000',
    maintenanceShortWeight: '1030000000000000000',
    baseAssetAddress: '0x4200000000000000000000000000000000000023',
    quoteAssetAddress: '0x79a59c326c715ac2d31c169c85d1232319e341ce',
    markPrice: '3399999999999999999772',
  },
]

describe('The HundredXClient withdraw function', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    // vi.setSystemTime(1709829760000)
  })

  it('should allow a user get a list of products', async () => {
    fetchMock.mockResponse(JSON.stringify(productsData))

    const Client = new HundredXClient(privateKey)

    const result = await Client.getProducts()

    expect(fetchMock.mock.calls[0][0]).toEqual('https://api.ciaobella.dev/v1/products')
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
      'https://api.ciaobella.dev/v1/products/product-by-id/1003',
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

    expect(fetchMock.mock.calls[0][0]).toEqual('https://api.ciaobella.dev/v1/products/ethperp')
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

  it('should handle an unknown error getting a specific product', async () => {
    fetchMock.mockReject(new Error('An unknown error occurred'))

    const Client = new HundredXClient(privateKey)

    const result = await Client.getProduct(1003)

    expect(result).toEqual({
      error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
      product: {},
    })
  })
})
