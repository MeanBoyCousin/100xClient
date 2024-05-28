import { describe, expect, it } from 'vitest'

import MARGIN_ASSETS from '../marginAssets'

describe('The MARGIN_ASSETS constant', () => {
  it('should stay unchanged', () => {
    expect(MARGIN_ASSETS).toMatchInlineSnapshot(`
      {
        "mainnet": {
          "USDB": "0x4300000000000000000000000000000000000003",
        },
        "testnet": {
          "USDB": "0x79a59c326c715ac2d31c169c85d1232319e341ce",
        },
      }
    `)
  })
})
