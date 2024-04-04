import type { MarginAssetKey } from './constants/marginAssets'
import type { EIP712Domain, Environment, HexString } from './types'
import type { PrivateKeyAccount, PublicClient, WalletClient } from 'viem'

import {
  BaseError,
  ContractFunctionRevertedError,
  createPublicClient,
  createWalletClient,
  http,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { eip712WalletActions } from 'viem/zksync'

import CIAO from './ABI/CIAO'
import ERC20 from './ABI/ERC20'
import CHAINS from './constants/chains'
import CIAO_ADDRESS from './constants/ciao'
import MARGIN_ASSETS from './constants/marginAssets'
import VERIFIER_ADDRESS from './constants/verifier'
import logger from './utils/logger'
import sleep from './utils/sleep'

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

  #getCurrentTimestamp = () => Date.now()

  #waitForTransaction = async (hash: HexString, message?: string) => {
    if (message) logger.waiting(message)

    try {
      await this.#publicClient.getTransactionReceipt({ hash })
    } catch (error) {
      await sleep(1000)
      await this.#waitForTransaction(hash)
    }
  }

  public deposit = async (quantity: number, asset: MarginAssetKey = 'USDB') => {
    logger.message(`Depositing ${quantity} ${asset}...`)

    const assetAddress = MARGIN_ASSETS[this.environment][asset]
    const bigQuantity = BigInt(quantity * 1e18)

    const allowance = await this.#publicClient.readContract({
      abi: ERC20,
      address: assetAddress,
      args: [this.account.address, this.ciaoAddress],
      functionName: 'allowance',
    })

    if (allowance < bigQuantity) {
      const approval = await this.#publicClient.simulateContract({
        account: this.account,
        abi: ERC20,
        address: assetAddress,
        args: [this.ciaoAddress, bigQuantity],
        functionName: 'approve',
      })
      const approvalHash = await this.#walletClient.writeContract(approval.request)
      await this.#waitForTransaction(approvalHash, 'Waiting for approval confirmation...')
    }

    try {
      const deposit = await this.#publicClient.simulateContract({
        account: this.account,
        abi: CIAO,
        address: this.ciaoAddress,
        args: [this.account.address, this.subAccountId, bigQuantity, assetAddress],
        functionName: 'deposit',
      })

      const depositHash = await this.#walletClient.writeContract(deposit.request)
      await this.#waitForTransaction(depositHash, 'Waiting for deposit confirmation...')

      logger.success('Deposit completed!')
    } catch (error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(error => error instanceof ContractFunctionRevertedError)

        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName
          logger.failure(`${revertError.shortMessage} Reason: ${errorName}.`)
        }
      }
    }
  }

  // Withdraw via API.
}

export default HundredXClient
