import { describe, expect, it } from 'vitest'

import CHAINS from '../chains'

describe('The CHAINS constant', () => {
  it('should stay unchanged', () => {
    expect(CHAINS).toMatchInlineSnapshot(`
      {
        "mainnet": {
          "id": 81457,
          "name": "Blast",
          "nativeCurrency": {
            "decimals": 18,
            "name": "Ether",
            "symbol": "ETH",
          },
          "rpcUrls": {
            "default": {
              "http": [
                "https://rpc.blast.io",
              ],
            },
          },
        },
        "testnet": {
          "id": 168587773,
          "name": "Blast Sepolia",
          "nativeCurrency": {
            "decimals": 18,
            "name": "Ether",
            "symbol": "ETH",
          },
          "rpcUrls": {
            "default": {
              "http": [
                "https://sepolia.blast.io",
              ],
            },
          },
        },
      }
    `)
  })
})
