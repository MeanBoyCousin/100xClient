import type { Environment, HexString } from 'src/types'

const VERIFIER_ADDRESS = {
  mainnet: '0x65CbB566D1A6E60107c0c7888761de1AdFa1ccC0',
  testnet: '0xdFd98d222377B2970Fc3e7748FA6bB31518AA49e',
} as Record<Environment, HexString>

export default VERIFIER_ADDRESS
