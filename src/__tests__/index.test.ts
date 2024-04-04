import type { Environment } from 'src/types'

import { describe, expect, it } from 'vitest'

import HundredXClient from ".."

describe('The HundredXClient', () => {
  const privateKey = '0xa608cd43cbc3d59bc51443f475b96a4654e956d6cc91783598a8e76a34000174'

  it('should initialise correctly with only required params', () => {
    const Client = new HundredXClient(privateKey)

    expect(Client).toMatchSnapshot()
  })

  it.each(['mainnet', 'testnet'] as [Environment, Environment])(
    'should initialise correctly with all parameters passed for a %s setup',
    environment => {
      const Client = new HundredXClient(privateKey, 2, environment, 'https://test-rpc.quiknode.pro')

      expect(Client).toMatchSnapshot()
    },
  )
})
