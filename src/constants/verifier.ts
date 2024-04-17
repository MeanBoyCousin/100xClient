import type { Environment, HexString } from 'src/types'

const VERIFIER_ADDRESS = {
  mainnet: '0x65CbB566D1A6E60107c0c7888761de1AdFa1ccC0',
  testnet: '0x02Ca4fcB63E2D3C89fa20D86ccDcfc540c683545',
} as Record<Environment, HexString>

export default VERIFIER_ADDRESS
