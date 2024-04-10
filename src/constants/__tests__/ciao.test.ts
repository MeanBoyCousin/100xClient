import { describe, expect, it } from 'vitest'

import CIAO_ADDRESS from '../ciao'

describe('The CIAO_ADDRESS constant', () => {
  it('should stay unchanged', () => {
    expect(CIAO_ADDRESS).toMatchInlineSnapshot(`
      {
        "mainnet": "0x63bD0ca355Cfc117F5176E5eF3e34A6D60081937",
        "testnet": "0x63bD0ca355Cfc117F5176E5eF3e34A6D60081937",
      }
    `)
  })
})
