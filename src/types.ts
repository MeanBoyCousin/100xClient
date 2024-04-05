// Config & common types
interface Config {
  debug?: boolean
  environment?: Environment
  rpc?: string
}

interface EIP712Domain {
  name: '100x'
  version: '0.0.0'
  chainId: bigint
  verifyingContract: HexString
}

type Environment = 'mainnet' | 'testnet'

type HexString = `0x${string}`

// Method return types
interface DepositReturnType {
  error?: {
    errorName?: string
    message: string
  }
  success: boolean
  transactionHash?: HexString
}

export { type Config, type DepositReturnType, type EIP712Domain, type Environment, type HexString }
