import type { Environment, HexString } from 'src/types'

const VERIFIER_ADDRESS = {
  mainnet: '0x691a5fc3a81a144e36c6c4fbca1fc82843c80d0d',
  testnet: '0x02ca4fcb63e2d3c89fa20d86ccdcfc540c683545',
} as Record<Environment, HexString>

export default VERIFIER_ADDRESS
