import type { Environment } from 'src/types'

import { describe, expect, it } from 'vitest'

import HundredXClient from 'src'
import { privateKey } from 'vitest/utils'

describe('The HundredXClient', () => {
  it('should initialise correctly with only required params', () => {
    const Client = new HundredXClient(privateKey)

    expect(Client).toMatchSnapshot()
  })

  it.each(['mainnet', 'testnet'] as [Environment, Environment])(
    'should initialise correctly with all config parameters passed for a %s setup',
    environment => {
      const Client = new HundredXClient(privateKey, 2, {
        debug: true,
        environment,
        rpc: 'https://test-rpc.quiknode.pro',
      })

      expect(Client).toMatchSnapshot()
    },
  )
})
