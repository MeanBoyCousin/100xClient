import type { Environment, HexString } from 'src/types'

import { MarginAssets } from 'src/enums'

type MarginAssetKey = keyof typeof MarginAssets

const MARGIN_ASSETS: Record<Environment, Record<MarginAssetKey, HexString>> = {
  mainnet: { [MarginAssets.USDB]: '0x4300000000000000000000000000000000000003' },
  testnet: { [MarginAssets.USDB]: '0x79a59c326c715ac2d31c169c85d1232319e341ce' },
}

export default MARGIN_ASSETS
export { type MarginAssetKey }
