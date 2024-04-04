import type { EIP712Domain, Environment, HexString } from './types'
import type { PrivateKeyAccount, PublicClient, WalletClient } from 'viem'

import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { eip712WalletActions } from 'viem/zksync'

import CHAINS from './constants/chains'
import CIAO_ADDRESS from './constants/ciao'
import VERIFIER_ADDRESS from './constants/verifier'

class HundredXClient {
  readonly account: PrivateKeyAccount
  readonly chain: number
  readonly ciaoAddress: HexString
  readonly domain: EIP712Domain
  readonly environment: Environment
  readonly privateKey: HexString
  readonly #publicClient: PublicClient
  readonly rpc: string
  readonly subAccountId: number
  readonly verifierAddress: HexString
  readonly #walletClient: WalletClient

  constructor(
    privateKey: HexString,
    subAccountId: number = 1,
    environment: Environment = 'testnet',
    rpc: string = CHAINS[environment].rpcUrls.default.http[0],
  ) {
    const account = privateKeyToAccount(privateKey)
    const chain = CHAINS[environment]
    const transport = http(rpc)
    const verifyingContract = VERIFIER_ADDRESS[environment]

    this.account = account
    this.chain = chain.id
    this.ciaoAddress = CIAO_ADDRESS[environment]
    this.domain = {
      name: '100x',
      version: '0.0.0',
      chainId: BigInt(chain.id),
      verifyingContract,
    }
    this.environment = environment
    this.privateKey = privateKey
    this.#publicClient = createPublicClient({
      chain,
      transport,
    })
    this.rpc = rpc
    this.subAccountId = subAccountId
    this.verifierAddress = verifyingContract
    this.#walletClient = createWalletClient({ account, chain, transport }).extend(
      eip712WalletActions(),
    )

    Object.freeze(this)
  }
}

export default HundredXClient
