import type {
  Environment as EnvironmentEnum,
  Interval,
  OrderStatus,
  OrderType,
  TimeInForce,
} from 'src/enums'

// Config & common types
interface Config {
  debug?: boolean
  environment?: Environment
  rpc?: string
  subAccountId?: number
}

interface EIP712Domain {
  name: '100x'
  version: '0.0.0'
  chainId: bigint
  verifyingContract: HexString
}

type Environment = EnvironmentEnum

type HexString = `0x${string}`

// Method param types

interface OrderArgs {
  expiration?: number
  isBuy: boolean
  nonce?: number
  orderType?: OrderType
  price: number
  productId: number
  quantity: number
  timeInForce?: TimeInForce
}

// API response types
interface BaseApiResponse {
  error?: string
  success: boolean
}

interface CancelOrder extends BaseApiResponse {}

interface CancelOrders extends CancelOrder {}

interface KlineOptionalArgs {
  endTime?: number
  interval?: Interval
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

interface Order extends Pick<BaseApiResponse, 'error'> {
  account: HexString
  createdAt: number
  expiry: number
  id: HexString
  isBuy: boolean
  nonce: number
  orderType: OrderType
  price: bigint
  productId: number
  productSymbol: string
  quantity: bigint
  residualQuantity: bigint
  sender: HexString
  signature: HexString
  status: OrderStatus
  subAccountId: number
  timeInForce: TimeInForce
}

type OrderBookRow = [bigint, bigint, bigint]
interface OrderBookResponse {
  asks: OrderBookRow[]
  bids: OrderBookRow[]
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

interface Ticker {
  fundingRateHourly: bigint
  fundingRateYearly: bigint
  high: bigint
  id: number
  low: bigint
  markPrice: bigint
  nextFundingTime: number
  openInterest: bigint
  oraclePrice: bigint
  priceChange: bigint
  priceChangePercent: string
  productSymbol: string
  volume: bigint
}
type TickerResponse = Ticker[]

// Method return types
interface ErrorReturnType {
  error?: {
    errorName?: string
    message: string
  }
}

interface CancelOrderReturnType extends ErrorReturnType {
  success: boolean
}

interface CancelOrdersReturnType extends ErrorReturnType {
  success: boolean
}

interface DepositReturnType extends ErrorReturnType {
  success: boolean
  transactionHash?: HexString
}

interface KlinesReturnType extends ErrorReturnType {
  klines: Kline[]
}

interface OrderBookReturnType extends ErrorReturnType, OrderBookResponse {}

interface PlaceOrderReturnType extends ErrorReturnType {
  order: Omit<Order, 'error'> | {}
}

interface ProductReturnType extends ErrorReturnType {
  product: ProductResponse | {}
}

interface ProductsReturnType extends ErrorReturnType {
  products: ProductsResponse
}

interface ServerTimeReturnType extends ErrorReturnType, Partial<ServerTimeResponse> {}

interface TickerReturnType extends ErrorReturnType {
  tickers: {
    [symbol: string]: Ticker
  }
}

interface WithdrawReturnType extends ErrorReturnType {
  success: boolean
}

export {
  OrderType,
  TimeInForce,
  type BaseApiResponse,
  type CancelOrder,
  type CancelOrderReturnType,
  type CancelOrders,
  type CancelOrdersReturnType,
  type Config,
  type DepositReturnType,
  type EIP712Domain,
  type Environment,
  type HexString,
  type KlineOptionalArgs,
  type KlinesResponse,
  type KlinesReturnType,
  type Order,
  type OrderArgs,
  type OrderBookResponse,
  type OrderBookReturnType,
  type PlaceOrderReturnType,
  type ProductResponse,
  type ProductReturnType,
  type ProductsResponse,
  type ProductsReturnType,
  type ServerTimeResponse,
  type ServerTimeReturnType,
  type TickerResponse,
  type TickerReturnType,
  type WithdrawReturnType,
}
