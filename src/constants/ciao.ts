import type { Environment, HexString } from 'src/types'

const CIAO_ADDRESS = {
  mainnet: '0x1baebee6b00b3f559b0ff0719b47e0af22a6bfc4',
  testnet: '0x0c3b9472b3923cfe199bae24b5f5bd75fad2bae9',
} as Record<Environment, HexString>

export default CIAO_ADDRESS
