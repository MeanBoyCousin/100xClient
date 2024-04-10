import { describe, expect, it } from 'vitest'

import VERIFIER_ADDRESS from '../verifier'

describe('The VERIFIER_ADDRESS constant', () => {
  it('should stay unchanged', () => {
    expect(VERIFIER_ADDRESS).toMatchInlineSnapshot(`
      {
        "mainnet": "0x65CbB566D1A6E60107c0c7888761de1AdFa1ccC0",
        "testnet": "0x65CbB566D1A6E60107c0c7888761de1AdFa1ccC0",
      }
    `)
  })
})
