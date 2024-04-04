import type { Environment, HexString } from 'src/types'

type MarginAssetKey = 'USDB'

const MARGIN_ASSETS: Record<Environment, Record<MarginAssetKey, HexString>> = {
  mainnet: { USDB: '0x0' },
  testnet: { USDB: '0x79a59c326c715ac2d31c169c85d1232319e341ce' },
}

export default MARGIN_ASSETS
export { type MarginAssetKey }
