import type { Environment } from 'src/types'
import type { Chain } from 'viem'

const chains: Record<Environment, Chain> = {
  mainnet: {
    id: 81457,
    name: 'Blast',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.blast.io'] } },
  },
  testnet: {
    id: 168587773,
    name: 'Blast Sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://sepolia.blast.io'] } },
  },
}

export default chains
