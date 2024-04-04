import type { TypedData } from 'viem'

const EIP712 = {
  EIP712Domain: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'version',
      type: 'string',
    },
    {
      name: 'chainId',
      type: 'uint256',
    },
    {
      name: 'verifyingContract',
      type: 'address',
    },
  ],
  Referral: [
    {
      name: 'account',
      type: 'address',
    },
    {
      name: 'code',
      type: 'string',
    },
  ],
  LoginMessage: [
    {
      name: 'account',
      type: 'address',
    },
    {
      name: 'message',
      type: 'string',
    },
    {
      name: 'timestamp',
      type: 'uint64',
    },
  ],
  Order: [
    {
      name: 'account',
      type: 'address',
    },
    {
      name: 'subAccountId',
      type: 'uint8',
    },
    {
      name: 'productId',
      type: 'uint32',
    },
    {
      name: 'isBuy',
      type: 'bool',
    },
    {
      name: 'orderType',
      type: 'uint8',
    },
    {
      name: 'timeInForce',
      type: 'uint8',
    },
    {
      name: 'expiration',
      type: 'uint64',
    },
    {
      name: 'price',
      type: 'uint128',
    },
    {
      name: 'quantity',
      type: 'uint128',
    },
    {
      name: 'nonce',
      type: 'uint64',
    },
  ],
  CancelOrders: [
    {
      name: 'account',
      type: 'address',
    },
    {
      name: 'subAccountId',
      type: 'uint8',
    },
    {
      name: 'productId',
      type: 'uint32',
    },
  ],
  CancelOrder: [
    {
      name: 'account',
      type: 'address',
    },
    {
      name: 'subAccountId',
      type: 'uint8',
    },
    {
      name: 'productId',
      type: 'uint32',
    },
    {
      name: 'orderId',
      type: 'string',
    },
  ],
  ApproveSigner: [
    {
      name: 'account',
      type: 'address',
    },
    {
      name: 'subAccountId',
      type: 'uint8',
    },
    {
      name: 'approvedSigner',
      type: 'address',
    },
    {
      name: 'isApproved',
      type: 'bool',
    },
    {
      name: 'nonce',
      type: 'uint64',
    },
  ],
  Deposit: [
    {
      name: 'account',
      type: 'address',
    },
    {
      name: 'subAccountId',
      type: 'uint8',
    },
    {
      name: 'asset',
      type: 'address',
    },
    {
      name: 'quantity',
      type: 'uint256',
    },
    {
      name: 'nonce',
      type: 'uint64',
    },
  ],
  Withdraw: [
    {
      name: 'account',
      type: 'address',
    },
    {
      name: 'subAccountId',
      type: 'uint8',
    },
    {
      name: 'asset',
      type: 'address',
    },
    {
      name: 'quantity',
      type: 'uint128',
    },
    {
      name: 'nonce',
      type: 'uint64',
    },
  ],
} as const satisfies TypedData

export default EIP712
