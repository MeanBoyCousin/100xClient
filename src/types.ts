import type { MarginAssetKey } from 'src/constants/marginAssets'
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

type ProductSymbol = `${string}perp`

// Method param types

interface OrderArgs {
  expiration?: number
  isBuy: boolean
  nonce?: number
  orderType?: OrderType
  price: number
  priceIncrement?: bigint
  productId: number
  quantity: number
  slippage?: number
  timeInForce?: TimeInForce
}

interface ReplacementOrderArgs extends Omit<OrderArgs, 'orderType' | 'timeInForce' | 'slippage'> {}

// API response types
interface BaseApiResponse {
  error?: string
  success: boolean
}

interface Balance {
  asset: HexString
  quantity: bigint
  pendingWithdrawal: bigint
}

interface CalculateMarginRequirement extends BaseApiResponse {
  value: bigint
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
  productSymbol: ProductSymbol
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

interface Position {
  account: HexString
  accruedFunding: bigint
  avgEntryPrice: bigint
  currentCumFunding: bigint
  initCumFunding: bigint
  liquidationPrice: bigint
  margin: bigint
  markPrice: bigint
  pnl: bigint
  productId: number
  productSymbol: ProductSymbol
  quantity: bigint
  subAccountId: number
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
  productId: number
  productSymbol: ProductSymbol
  volume: bigint
}
type TickerResponse = Ticker[]

interface Trade {
  createdAt: number
  makerAccount: HexString
  makerFees: bigint
  makerID: HexString
  makerSubaccountId: number
  price: bigint
  quantity: bigint
  takerAccount: HexString
  takerFees: bigint
  takerID: HexString
  takerIsBuyer: boolean
  takerSubaccountId: number
  uid: string
}

interface TradeHistoryResponse extends BaseApiResponse {
  trades: Trade[] | null
}

// Method return types
interface ErrorReturnType {
  error?: {
    errorName?: string
    message: string
  }
}

interface BalancesReturnType extends ErrorReturnType {
  balances: {
    address: HexString
    asset: MarginAssetKey
    quantity: bigint
    pendingWithdrawal: bigint
  }[]
}

interface CalculateMarginRequirementReturnType extends ErrorReturnType {
  required: bigint
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

interface OpenOrdersReturnType extends ErrorReturnType {
  orders: Order[]
}

interface OrderBookReturnType extends ErrorReturnType, OrderBookResponse {}

interface PlaceOrderReturnType extends ErrorReturnType {
  order: Omit<Order, 'error'> | {}
}

interface PositionsReturnType extends ErrorReturnType {
  positions: Position[]
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

interface TradeHistoryReturnType extends ErrorReturnType {
  trades: Trade[]
}

interface WithdrawReturnType extends ErrorReturnType {
  success: boolean
}

export {
  OrderType,
  TimeInForce,
  type Balance,
  type BalancesReturnType,
  type BaseApiResponse,
  type CalculateMarginRequirement,
  type CalculateMarginRequirementReturnType,
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
  type OpenOrdersReturnType,
  type Order,
  type OrderArgs,
  type OrderBookResponse,
  type OrderBookReturnType,
  type PlaceOrderReturnType,
  type Position,
  type PositionsReturnType,
  type ProductResponse,
  type ProductReturnType,
  type ProductsResponse,
  type ProductsReturnType,
  type ProductSymbol,
  type ReplacementOrderArgs,
  type ServerTimeResponse,
  type ServerTimeReturnType,
  type TickerResponse,
  type TickerReturnType,
  type TradeHistoryResponse,
  type TradeHistoryReturnType,
  type WithdrawReturnType,
}
