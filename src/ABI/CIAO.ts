const CIAO = [
  {
    type: 'function',
    name: 'deposit',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'subAccountId',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'quantity',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'asset',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    name: 'BalanceInsufficient',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DepositQuantityInvalid',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidInitialization',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NotInitializing',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ProductInvalid',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SenderInvalid',
    inputs: [],
  },
  {
    type: 'error',
    name: 'WithdrawQuantityInvalid',
    inputs: [],
  },
] as const

export default CIAO
