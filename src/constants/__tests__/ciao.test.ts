import { describe, expect, it } from 'vitest'

import CIAO_ADDRESS from '../ciao'

describe('The CIAO_ADDRESS constant', () => {
  it('should stay unchanged', () => {
    expect(CIAO_ADDRESS).toMatchInlineSnapshot(`
      {
        "mainnet": "0x1baebee6b00b3f559b0ff0719b47e0af22a6bfc4",
        "testnet": "0x0c3b9472b3923cfe199bae24b5f5bd75fad2bae9",
      }
    `)
  })
})
