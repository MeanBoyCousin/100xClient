import type { MarginAssetKey } from './constants/marginAssets'
import type {
  BaseApiResponse,
  Config,
  DepositReturnType,
  EIP712Domain,
  Environment,
  HexString,
  WithdrawReturnType,
} from './types'
import type { Logger } from 'pino'
import type { PrivateKeyAccount, PublicClient, WalletClient } from 'viem'

import logger from 'pino'
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
import EIP712 from './ABI/EIP712'
import ERC20 from './ABI/ERC20'
import API_URL from './constants/api'
import CHAINS from './constants/chains'
import CIAO_ADDRESS from './constants/ciao'
import MARGIN_ASSETS from './constants/marginAssets'
import VERIFIER_ADDRESS from './constants/verifier'
import sleep from './utils/sleep'

class HundredXClient {
  readonly account: PrivateKeyAccount
  readonly chain: number
  readonly ciaoAddress: HexString
  readonly domain: EIP712Domain
  readonly environment: Environment
  readonly #logger: Logger
  readonly logs: {}[]
  readonly privateKey: HexString
  readonly #publicClient: PublicClient
  readonly rpc: string
  readonly subAccountId: number
  readonly verifierAddress: HexString
  readonly #walletClient: WalletClient

  constructor(privateKey: HexString, subAccountId: number = 1, config?: Config) {
    const debug = config?.debug || false
    const environment = config?.environment || 'testnet'
    const rpc = config?.rpc || CHAINS[environment].rpcUrls.default.http[0]

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
    this.#logger = logger({
      level: debug ? 'trace' : 'info',
      name: '100x-client',
      mixin: (messageObject, level) => {
        if (level > logger.levels.values.debug) this.logs.push(messageObject)

        return messageObject
      },
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    })
    this.logs = []
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

    if (debug) this.#logger.info({ msg: 'Debug mode enabled' })

    Object.freeze(this)
  }

  /**
   * Fetches data from the 100x API asynchronously.
   *
   * @template TypedResponse - The type expected for the parsed JSON response.
   * @param {string} path - The API endpoint path relative to the base API URL.
   * @param {RequestInit} config - (Optional) An object containing configuration options for the fetch request.
   *   See [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for details.
   *
   * @returns {Promise<TypedResponse>} A promise that resolves with the parsed JSON response as the specified type.
   */
  #fetchFromAPI = async <TypedResponse>(
    path: string,
    config?: RequestInit,
  ): Promise<TypedResponse> => {
    const url = `${API_URL[this.environment]}/${path}`
    this.#logger.debug({
      ...config,
      body: config?.body ? JSON.parse(config.body as string) : undefined,
      msg: 'Communicating with API...',
      url,
    })

    const response = await fetch(url, config)

    return (await response.json()) as TypedResponse
  }

  /**
   * Gets the current timestamp in milliseconds.
   *
   * @returns {number} The current timestamp in milliseconds.
   */
  #getCurrentTimestamp = (): number => Date.now()

  /**
   * Converts a decimal number of Ether to Wei.
   *
   * @param {number} value - The decimal number representing the quantity in Ether.
   * @returns {bigint} The equivalent value in Wei as a BigInt.
   */
  #toWei = (value: number): bigint => BigInt(value * 1e18)

  #waitForTransaction = async (hash: HexString, message: string): Promise<void> => {
    if (message) this.#logger.info({ msg: message })

    try {
      const txReceipt = await this.#publicClient.getTransactionReceipt({ hash })
      this.#logger.debug({ hash, msg: 'Transaction receipt:', txReceipt })
    } catch (error) {
      await sleep(1000)
      await this.#waitForTransaction(hash, '')
    }
  }

  public deposit = async (
    quantity: number,
    asset: MarginAssetKey = 'USDB',
  ): Promise<DepositReturnType> => {
    this.#logger.info({ msg: `Depositing ${quantity} ${asset}...` })

    const assetAddress = MARGIN_ASSETS[this.environment][asset]
    const bigQuantity = BigInt(quantity * 1e18)

    const allowance = await this.#publicClient.readContract({
      abi: ERC20,
      address: assetAddress,
      args: [this.account.address, this.ciaoAddress],
      functionName: 'allowance',
    })

    try {
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

      const deposit = await this.#publicClient.simulateContract({
        account: this.account,
        abi: CIAO,
        address: this.ciaoAddress,
        args: [this.account.address, this.subAccountId, bigQuantity, assetAddress],
        functionName: 'deposit',
      })

      const depositHash = await this.#walletClient.writeContract(deposit.request)
      await this.#waitForTransaction(depositHash, 'Waiting for deposit confirmation...')

      this.#logger.info({ msg: 'Deposit completed!' })
      return {
        success: true,
        transactionHash: depositHash,
      }
    } catch (error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(error => error instanceof ContractFunctionRevertedError)

        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName
          const errorResponse = {
            errorName,
            message: revertError.shortMessage.replace(/"/g, `'`),
          }

          this.#logger.error({ ...errorResponse, msg: 'An error occurred.' })
          this.#logger.debug({ err: error })
          return {
            error: errorResponse,
            success: false,
          }
        }
      }

      this.#logger.debug({ err: error })
      return {
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        success: false,
      }
    }
  }

  /**
   * Withdraw a specified quantity of an asset.
   *
   * @param {number} quantity The amount of the asset to withdraw.
   * @param {MarginAssetKey} [asset='USDB'] The type of asset to withdraw (default: USDB).
   * @returns {Promise<WithdrawReturnType>} A promise that resolves with an object containing the withdrawal status, or an error object.
   *
   * @throws {Error} Thrown if an error occurs during the withdrawal process. The error object may contain details from the API response or a generic message.
   */
  public withdraw = async (
    quantity: number,
    asset: MarginAssetKey = 'USDB',
  ): Promise<WithdrawReturnType> => {
    this.#logger.info({ msg: `Withdrawing ${quantity} ${asset}...` })

    const bigQuantity = this.#toWei(quantity)
    const nonce = this.#getCurrentTimestamp()

    const sharedParams = {
      account: this.account.address,
      asset: MARGIN_ASSETS[this.environment][asset],
      subAccountId: this.subAccountId,
    }
    const message = {
      ...sharedParams,
      nonce: BigInt(nonce),
      quantity: bigQuantity,
    }

    try {
      const signature = await this.account.signTypedData({
        domain: this.domain,
        message,
        primaryType: 'Withdraw',
        types: EIP712,
      })

      this.#logger.debug({
        msg: 'Generated signature with following params:',
        ...message,
      })

      const { error, success } = await this.#fetchFromAPI<BaseApiResponse>('withdraw', {
        body: JSON.stringify({
          ...sharedParams,
          nonce,
          quantity: bigQuantity.toString(),
          signature,
        }),
        method: 'POST',
      })

      if (error) {
        this.#logger.error({ msg: error })
        return {
          error: { message: error },
          success: false,
        }
      }

      this.#logger.info({ msg: 'Withdrawal completed!' })
      return { success }
    } catch (error) {
      this.#logger.debug({ err: error })
      return {
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        success: false,
      }
    }
  }
}

export default HundredXClient
