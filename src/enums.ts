enum Environment {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

enum Interval {
  '1M' = '1m',
  '5M' = '5m',
  '15M' = '15m',
  '30M' = '30m',
  '1H' = '1h',
  '2H' = '2h',
  '4H' = '4h',
  '8H' = '8h',
  '1D' = '1d',
  '3D' = '3d',
  '1W' = '1w',
}

enum MarginAssets {
  USDB = 'USDB',
}

enum OrderStatus {
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  FILLED = 'FILLED',
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

enum OrderType {
  LIMIT = 0,
  LIMIT_MAKER = 1,
  MARKET = 2,
}

enum TimeInForce {
  GTC = 0,
  FOK = 1,
  IOC = 2,
}

export { Environment, Interval, MarginAssets, OrderStatus, OrderType, TimeInForce }
