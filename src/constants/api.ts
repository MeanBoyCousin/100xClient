import type { Environment } from 'src/types'

const API_URL = {
  mainnet: 'https://api.100x.finance/v1',
  testnet: 'https://api.staging.100x.finance/v1',
} as Record<Environment, string>

export default API_URL
