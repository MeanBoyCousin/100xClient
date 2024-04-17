import type { Environment, HexString } from 'src/types'

const CIAO_ADDRESS = {
  mainnet: '0x63bD0ca355Cfc117F5176E5eF3e34A6D60081937',
  testnet: '0x0c3b9472b3923CfE199bAE24B5f5bD75FAD2bae9',
} as Record<Environment, HexString>

export default CIAO_ADDRESS
