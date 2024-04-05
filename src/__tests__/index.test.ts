import type { Environment } from 'src/types'

import { BaseError, ContractFunctionRevertedError, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CIAO from 'src/ABI/CIAO'
import CHAINS from 'src/constants/chains'

import HundredXClient from '..'

// User variables.
const address = '0xb47B0b1e44B932Ae9Bb01817E7010A553A965Ea8'
const privateKey = '0xa608cd43cbc3d59bc51443f475b96a4654e956d6cc91783598a8e76a34000174'

// Contract addresses
const ciaoAddress = '0x63bD0ca355Cfc117F5176E5eF3e34A6D60081937'
const USDB = '0x79a59c326c715ac2d31c169c85d1232319e341ce'

// Mocks
const mocks = vi.hoisted(() => ({
  createPublicClient: {
    getTransactionReceipt: vi.fn(),
    readContract: vi.fn(),
    simulateContract: vi.fn(),
  },
  createWalletClient: { writeContract: vi.fn() },
}))

vi.mock('viem', async () => {
  const actual = (await vi.importActual('viem')) as any

  return {
    ...actual,
    createPublicClient: vi.fn(() => ({
      ...actual.createPublicClient({
        chain: CHAINS.testnet,
        transport: http(CHAINS.testnet.rpcUrls.default.http[0]),
      }),
      ...mocks.createPublicClient,
    })),
    createWalletClient: vi.fn(() => ({
      extend: vi.fn(() => ({
        ...actual.createWalletClient({
          account: privateKeyToAccount(privateKey),
          chain: CHAINS.testnet,
          transport: http(CHAINS.testnet.rpcUrls.default.http[0]),
        }),
        ...mocks.createWalletClient,
      })),
    })),
  }
})

describe('The HundredXClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  it('should initialise correctly with only required params', () => {
    const Client = new HundredXClient(privateKey)

    expect(Client).toMatchSnapshot()
  })

  it.each(['mainnet', 'testnet'] as [Environment, Environment])(
    'should initialise correctly with all config parameters passed for a %s setup',
    environment => {
      const Client = new HundredXClient(privateKey, 2, {
        debug: true,
        environment,
        rpc: 'https://test-rpc.quiknode.pro',
      })

      expect(Client).toMatchSnapshot()
    },
  )

  it('should allow a user to deposit funds with no previous approval', async () => {
    mocks.createPublicClient.readContract.mockReturnValue(BigInt(10e18))
    mocks.createPublicClient.simulateContract.mockReturnValue({ request: true })
    mocks.createWalletClient.writeContract.mockReturnValue('0x1234546')
    mocks.createPublicClient.getTransactionReceipt.mockReturnValue({ status: 'success' })

    const Client = new HundredXClient(privateKey)

    const result = await Client.deposit(100)

    await vi.runOnlyPendingTimersAsync()

    // Approval
    expect(mocks.createPublicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: USDB,
        args: [address, ciaoAddress],
        functionName: 'allowance',
      }),
    )
    expect(mocks.createPublicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: USDB,
        args: [ciaoAddress, 100000000000000000000n],
        functionName: 'approve',
      }),
    )
    expect(mocks.createWalletClient.writeContract).toHaveBeenNthCalledWith(1, true)

    // Deposit
    expect(mocks.createPublicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: ciaoAddress,
        args: [address, 1, 100000000000000000000n, USDB],
        functionName: 'deposit',
      }),
    )
    expect(mocks.createWalletClient.writeContract).toHaveBeenNthCalledWith(2, true)
    expect(result).toEqual({ success: true, transactionHash: '0x1234546' })
    expect(Client.logs).toMatchInlineSnapshot(`
      [
        {
          "msg": "Depositing 100 USDB...",
        },
        {
          "msg": "Waiting for approval confirmation...",
        },
        {
          "msg": "Waiting for deposit confirmation...",
        },
        {
          "msg": "Deposit completed!",
        },
      ]
    `)
  })

  it('should allow a user to deposit funds with sufficient existing approval', async () => {
    mocks.createPublicClient.readContract.mockReturnValue(BigInt(100e18))
    mocks.createPublicClient.simulateContract.mockReturnValue({ request: true })
    mocks.createWalletClient.writeContract.mockReturnValue('0x1234546')
    mocks.createPublicClient.getTransactionReceipt.mockReturnValue({ status: 'success' })

    const Client = new HundredXClient(privateKey)

    const result = await Client.deposit(100)

    await vi.runOnlyPendingTimersAsync()

    expect(mocks.createPublicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: ciaoAddress,
        args: [address, 1, 100000000000000000000n, USDB],
        functionName: 'deposit',
      }),
    )
    expect(mocks.createWalletClient.writeContract).toHaveBeenCalledOnce()
    expect(result).toEqual({ success: true, transactionHash: '0x1234546' })
  })

  it('should surface errors to the user when they are of a known type', async () => {
    mocks.createPublicClient.readContract.mockReturnValue(BigInt(1000e18))
    mocks.createPublicClient.simulateContract.mockRejectedValue(
      new BaseError('This is the short message.', {
        cause: new ContractFunctionRevertedError({
          abi: CIAO,
          data: '0x5220d104',
          functionName: 'deposit',
        }),
      }),
    )

    const Client = new HundredXClient(privateKey)

    const result = await Client.deposit(100)

    await vi.runOnlyPendingTimersAsync()

    expect(mocks.createWalletClient.writeContract).not.toHaveBeenCalled()
    expect(result).toEqual({
      error: {
        errorName: 'DepositQuantityInvalid',
        message: "The contract function 'deposit' reverted.",
      },
      success: false,
    })
  })

  it('should surface errors to the user when they are unknown', async () => {
    mocks.createPublicClient.readContract.mockReturnValue(BigInt(1000e18))
    mocks.createPublicClient.simulateContract.mockRejectedValue(
      new Error('An unknown error occurred.'),
    )

    const Client = new HundredXClient(privateKey)

    const result = await Client.deposit(100)

    await vi.runOnlyPendingTimersAsync()

    expect(mocks.createWalletClient.writeContract).not.toHaveBeenCalled()
    expect(result).toEqual({
      error: { message: 'An unknown error occurred. Try enabled debug mode for mode detail.' },
      success: false,
    })
  })

  it('should recursively check for transaction receipts if there is an error', async () => {
    mocks.createPublicClient.readContract.mockReturnValue(BigInt(1000e18))
    mocks.createPublicClient.simulateContract.mockReturnValue({ request: true })
    mocks.createWalletClient.writeContract.mockReturnValue('0x1234546')
    mocks.createPublicClient.getTransactionReceipt.mockRejectedValue('error')

    const Client = new HundredXClient(privateKey)

    Client.deposit(100)

    await vi.runOnlyPendingTimersAsync()

    expect(mocks.createPublicClient.getTransactionReceipt).rejects.toThrow('error')

    mocks.createPublicClient.getTransactionReceipt.mockReturnValue({ status: 'success' })

    await vi.advanceTimersByTimeAsync(5000)

    expect(mocks.createPublicClient.getTransactionReceipt).toHaveReturnedWith({ status: 'success' })
    expect(Client.logs).toMatchInlineSnapshot(`
      [
        {
          "msg": "Depositing 100 USDB...",
        },
        {
          "msg": "Waiting for deposit confirmation...",
        },
        {
          "msg": "Deposit completed!",
        },
      ]
    `)
  })
})
