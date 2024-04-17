import type { Environment, HexString } from 'src/types'

const CIAO_ADDRESS = {
  mainnet: '0x63bD0ca355Cfc117F5176E5eF3e34A6D60081937',
  testnet: '0x44034C668FfcE5b4dA5AA4B24cD936244dEa3aC8',
} as Record<Environment, HexString>

export default CIAO_ADDRESS
