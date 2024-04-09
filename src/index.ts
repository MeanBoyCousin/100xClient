import type { MarginAssetKey } from './constants/marginAssets'
import type {
  BaseApiResponse,
  Config,
  DepositReturnType,
  EIP712Domain,
  Environment,
  HexString,
  KlineOptionalArgs,
  KlinesResponse,
  KlinesReturnType,
  ProductResponse,
  ProductReturnType,
  ProductsResponse,
  ProductsReturnType,
  ServerTimeResponse,
  ServerTimeReturnType,
  WithdrawReturnType,
} from './types'
import type { Logger } from 'pino'
import type { PrivateKeyAccount, PublicClient, WalletClient } from 'viem'

import logger, { levels } from 'pino'
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

  /**
   * Creates a new instance of the 100x client.
   * See {@link https://100x.readme.io/} for detailed documentation.
   *
   * @param {HexString} privateKey The private key used to sign transactions.
   * @param {number} [subAccountId=1] The sub-account ID to use. Defaults to 1.
   * @param {Config} [config] Optional configuration options.
   * @param {Config["debug"]} config.debug Enable debug mode.
   * @param {Config["environment"]} config.environment The environment to use. Defaults to "testnet".
   * @param {Config["rpc"]} config.rpc The RPC URL to use.
   * @throws {Error} If the provided private key is invalid.
   *
   * @property {Account} account The Ethereum account derived from the provided private key.
   * @property {number} chain The chain ID of the connected network.
   * @property {string} ciaoAddress The address of the CIAO contract on the connected network.
   * @property {Domain} domain The EIP-712 domain information used for transaction signing.
   * @property {string} environment The name of the connected network environment.
   * @property {Array<Object>} logs An array containing logged messages. This may be useful for debugging.
   * @property {HexString} privateKey The provided private key.
   * @property {string} rpc The RPC URL of the connected network.
   * @property {number} subAccountId The configured sub-account ID.
   * @property {string} verifierAddress The address of the verification contract on the connected network.
   */
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
        if (level > levels.values.debug) this.logs.push(messageObject)

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

  /**
   * Waits for a transaction on the blockchain to be mined and included in a block.
   *
   * This function takes a transaction hash and an optional message as arguments. It attempts to
   * retrieve the transaction receipt using the provided client. In case of an error, it waits
   * for a second and then recursively calls itself again to retry fetching the receipt.
   *
   * @param {HexString} hash - The hexadecimal hash of the transaction to wait for.
   * @param {string} message - (Optional) A message to log before waiting for the transaction.
   * @returns {Promise<void>} (Implicit) This function does not explicitly return a value, but it waits
   * for the transaction to be mined and logs related information.
   */
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

  // --------------
  // REST endpoints
  // --------------

  /**
   * Get K-line (candlestick) chart data for a product.
   *
   * {@link https://100x.readme.io/reference/ui-klines}
   *
   * @param {string} productSymbol The product symbol to get data for (btcperp, ethperp, etc.).
   * @param {KlineOptionalArgs} [optionalArgs] Optional query parameters.
   * @param {KlineOptionalArgs["endTime"]} config.endTime The end time range to query in unix milliseconds.
   * @param {KlineOptionalArgs["interval"]} config.interval The time interval for each K-line.
   * Options are '1m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '8h' | '1d' | '3d' | '1w'.
   * @param {KlineOptionalArgs["limit"]} config.limit The amount of K-lines to fetch. Should be between 1 & 1000 inclusive.
   * @param {KlineOptionalArgs["startTime"]} config.startTime The start time range to query in unix milliseconds.
   * @returns {Promise<KlinesReturnType>} A promise that resolves with an object containing the K-line data, or an error object.
   *
   * @throws {Error} Thrown if an error occurs during the withdrawal process. The error object may contain details from the API response or a generic message.
   */
  public getKlines = async (
    productSymbol: string,
    optionalArgs?: KlineOptionalArgs,
  ): Promise<KlinesReturnType> => {
    if (optionalArgs) {
      if (Number(optionalArgs.limit) > 1000 || Number(optionalArgs.limit) <= 0) {
        return {
          error: { message: 'Limit must be between 0 and 1000.' },
          klines: [],
        }
      }

      if (Number(optionalArgs.startTime) > Number(optionalArgs.endTime)) {
        return {
          error: { message: 'Start time cannot be after end time.' },
          klines: [],
        }
      }

      if (Number(optionalArgs.startTime) > this.#getCurrentTimestamp()) {
        return {
          error: { message: 'Start time cannot be in the future.' },
          klines: [],
        }
      }
    }

    const queryParams = optionalArgs
      ? `${Object.entries(optionalArgs)
          .map(([key, value]) => `&${key}=${value}`)
          .join('')}`
      : ''

    try {
      const klines = await this.#fetchFromAPI<KlinesResponse>(
        `uiKlines?symbol=${productSymbol}${queryParams}`,
      )

      return { klines }
    } catch (error) {
      this.#logger.debug({ err: error })
      return {
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        klines: [],
      }
    }
  }

  /**
   * Get a list of all products.
   *
   * {@link https://100x.readme.io/reference/list-products}
   *
   * @returns {Promise<ProductsReturnType>} A promise that resolves with an object containing a list of products, or an error object.
   */
  public getProducts = async (): Promise<ProductsReturnType> => {
    try {
      const products = await this.#fetchFromAPI<ProductsResponse>('products')

      return { products }
    } catch (error) {
      this.#logger.debug({ err: error })
      return {
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        products: [],
      }
    }
  }

  /**
   * Get a specific product.
   *
   * {@link https://100x.readme.io/reference/get-product} - By product ID.
   *
   * {@link https://100x.readme.io/reference/get-product-copy} - By product symbol.
   *
   * @returns {Promise<ProductsReturnType>} A promise that resolves with an object containing the product, or an error object.
   */
  public getProduct = async (identifier: number | string): Promise<ProductReturnType> => {
    try {
      if (typeof identifier === 'number') {
        const product = await this.#fetchFromAPI<ProductResponse>(
          `products/product-by-id/${identifier}`,
        )

        return { product }
      }

      const product = await this.#fetchFromAPI<ProductResponse>(`products/${identifier}`)

      return { product }
    } catch (error) {
      this.#logger.debug({ err: error })
      return {
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
        product: {},
      }
    }
  }

  /**
   * Get the current server time in unix milliseconds.
   *
   * {@link https://100x.readme.io/reference/server-time}
   *
   * @returns {Promise<ServerTimeReturnType>} A promise that resolves with an object containing the timestamp, or an error object.
   */
  public getServerTime = async (): Promise<ServerTimeReturnType> => {
    try {
      return await this.#fetchFromAPI<ServerTimeResponse>('time')
    } catch (error) {
      this.#logger.debug({ err: error })
      return {
        error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
      }
    }
  }

  // REST AUTH endpoints

  /**
   * Deposits a specified quantity of an asset.
   *
   * {@link https://100x.readme.io/reference/depositing}
   *
   * @param {number} quantity The amount of the asset to deposit.
   * @param {MarginAssetKey} [asset='USDB'] The type of asset to deposit (default: USDB).
   * @returns {Promise<DepositReturnType>} A promise that resolves with an object containing the deposit status and transaction hash, or an error object.
   *
   * @throws {ContractFunctionRevertedError} Thrown if a user-facing error occurs during the deposit, such as insufficient allowance or failed deposit. The error object will contain the error name and message.
   * @throws {BaseError} Thrown if an unexpected error occurs during the deposit. The error object may not provide user-friendly messages.
   */
  public deposit = async (
    quantity: number,
    asset: MarginAssetKey = 'USDB',
  ): Promise<DepositReturnType> => {
    this.#logger.info({ msg: `Depositing ${quantity} ${asset}...` })

    const assetAddress = MARGIN_ASSETS[this.environment][asset]
    const bigQuantity = this.#toWei(quantity)

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
   * {@link https://100x.readme.io/reference/withdraw}
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
