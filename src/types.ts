interface EIP712Domain {
  name: '100x'
  version: '0.0.0'
  chainId: bigint
  verifyingContract: HexString
}

type Environment = 'mainnet' | 'testnet'
type HexString = `0x${string}`

export { type EIP712Domain, type Environment, type HexString }
