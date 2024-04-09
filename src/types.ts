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

interface KlineOptionalArgs {
  endTime?: number
  interval?: '1m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '8h' | '1d' | '3d' | '1w'
  limit?: number
  startTime?: number
}

interface Kline {
  e: 'klines_'
  E: number
  s: string
  i: KlineOptionalArgs['interval']
  o: bigint
  c: bigint
  h: bigint
  l: bigint
  v: bigint
  x: boolean
}

type KlinesResponse = Kline[]

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

interface KlinesReturnType extends ErrorReturnType {
  klines: Kline[]
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
  type KlineOptionalArgs,
  type KlinesReturnType,
  type KlinesResponse,
  type ProductResponse,
  type ProductReturnType,
  type ProductsResponse,
  type ProductsReturnType,
  type ServerTimeResponse,
  type ServerTimeReturnType,
  type WithdrawReturnType,
}
