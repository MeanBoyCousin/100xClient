import { describe, expect, it } from 'vitest'

import VERIFIER_ADDRESS from '../verifier'

describe('The VERIFIER_ADDRESS constant', () => {
  it('should stay unchanged', () => {
    expect(VERIFIER_ADDRESS).toMatchInlineSnapshot(`
      {
        "mainnet": "0x691a5fc3a81a144e36c6c4fbca1fc82843c80d0d",
        "testnet": "0x02ca4fcb63e2d3c89fa20d86ccdcfc540c683545",
      }
    `)
  })
})
