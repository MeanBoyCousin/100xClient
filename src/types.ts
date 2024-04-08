// Config & common types
interface BaseApiResponse {
  error?: string
  success: boolean
}

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
interface ErrorReturnType {
  error?: {
    errorName?: string
    message: string
  }
}

interface DepositReturnType extends ErrorReturnType {
  success: boolean
  transactionHash?: HexString
}

interface WithdrawReturnType extends ErrorReturnType {
  success: boolean
}

export {
  type BaseApiResponse,
  type Config,
  type DepositReturnType,
  type EIP712Domain,
  type Environment,
  type HexString,
  type WithdrawReturnType,
}
