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

// API response types
interface BaseApiResponse {
  error?: string
  success: boolean
}

interface Product {
  active: boolean
  baseAsset: string
  baseAssetAddress: HexString
  increment: bigint
  id: number
  initialLongWeight: bigint
  initialShortWeight: bigint
  isMakerRebate: boolean
  makerFee: bigint
  maintenanceLongWeight: bigint
  maintenanceShortWeight: bigint
  markPrice: bigint
  maxQuantity: bigint
  minQuantity: bigint
  quoteAsset: string
  quoteAssetAddress: HexString
  symbol: string
  takerFee: bigint
  type: string
}
type ProductResponse = Product
type ProductsResponse = Product[]

interface ServerTimeResponse {
  serverTime: number
}

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

interface ProductReturnType extends ErrorReturnType {
  product: ProductResponse | {}
}

interface ProductsReturnType extends ErrorReturnType {
  products: ProductsResponse
}

interface ServerTimeReturnType extends ErrorReturnType, Partial<ServerTimeResponse> {}

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
  type ProductResponse,
  type ProductReturnType,
  type ProductsResponse,
  type ProductsReturnType,
  type ServerTimeResponse,
  type ServerTimeReturnType,
  type WithdrawReturnType,
}
