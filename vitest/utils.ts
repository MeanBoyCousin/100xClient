// User variables.
export const address = '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8'
export const privateKey = '0xa608cd43cbc3d59bc51443f475b96a4654e956d6cc91783598a8e76a34000174'

// Contract addresses
export const ciaoAddress = '0x63bD0ca355Cfc117F5176E5eF3e34A6D60081937'
export const USDB = '0x79a59c326c715ac2d31c169c85d1232319e341ce'

// API response mocks
export const productsData = [
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
