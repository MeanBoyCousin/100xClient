<p align="center">
  <img alt="100x Logo" src="https://app.100x.finance/brand/100x-trade-perps.webp" />
</p>

![Build](https://img.shields.io/github/actions/workflow/status/MeanBoyCousin/100xClient/release.yml?style=flat-square&label=Build&color=%234177f6&link=https://github.com/MeanBoyCousin/100xClient/actions/workflows/release.yml)
![NPM Version](https://img.shields.io/npm/v/100x-client?style=flat-square&label=NPM&color=%234177f6&link=https://www.npmjs.com/package/100x-client)
![Discord](https://img.shields.io/discord/1203621012659249192?style=flat-square&logo=discord&logoColor=%23fff&label=Discord&color=%234177f6&link=https://discord.gg/100xdex)

Interact with the [100x decentralized exchange](https://100x.finance/) and trade pre-launch tokens, BTC, ETH, SOL, BLUR and other cryptocurrency perp futures with leverage. Live on [Blast](https://blast.io/en).

```bash
npm install 100x-client
# or
yarn add 100x-client
# or
pnpm add 100x-client
# or
bun install 100x-client
```

## Usage

Getting started is a simple case of importing the Client and instantiating an instance.

```ts
import HundredXClient from '100x-client'

const MY_PRIVATE_KEY = '0x...'

const Client = new HundredXClient(MY_PRIVATE_KEY)
```

The client can also accept a configuration object as the second parameter.

| Key          | Type                     | Default                        | Description                                                               |
|--------------|--------------------------|--------------------------------|---------------------------------------------------------------------------|
| debug        | `boolean`                | `false`                          | Used to enable debug mode when running the client for additional logging. |
| environment  | `'testnet' \| 'mainnet'` | `'testnet'`                      | Specify the environment you wish to trade in.                             |
| rpc          | `string`                 | `Blast RPC based on environment` | Specify a custom RPC url to used.                                         |
| subAccountId | `number`                 | `1`                              | Specify a sub-account ID to use. This can be from 1-255.                  |

```ts
import HundredXClient from '100x-client'

const CONFIG = {
  debug: false,
  environment: 'testnet',
  rpc: 'https://sepolia.blast.io',
  subAccountId: 1,
}
const MY_PRIVATE_KEY = '0x...'

const Client = new HundredXClient(MY_PRIVATE_KEY)
```

## Getting started

To get started, you will need to deposit funds and make a trade. Let's look at how we can do that now. If you're in need of testnet funds, please head over to the [100x Discord server](https://discord.gg/100xdex) where we will be happy to help.

```ts
import HundredXClient from '100x-client'
import { OrderType, TimeInForce } from '100x-client/enums'

const MY_PRIVATE_KEY = '0x...'

const Client = new HundredXClient(MY_PRIVATE_KEY)

// Let's deposit 1000 USDB to get started. By default deposits are in USDB.
const { error, success, transactionHash } = await Client.deposit(1000)

// Now we can make an order. Let's go long on some ETH!
if (success) {
  const { error, order } = await Client.placeOrder({
    isBuy: true,
    orderType: OrderType.LIMIT,
    price: 2990,
    productId: 1002,
    quantity: 1,
    timeInForce: TimeInForce.GTC,
  })

  // Finally let's log out our order to check the details.
  console.log(order)
}
```

### Handy enums

A series of useful enums can be imported from `100x-client/enums` and used to help match against responses or compose payloads.

| Name         | Values                                                                                   | Description                                          |
|--------------|------------------------------------------------------------------------------------------|------------------------------------------------------|
| Environment  | `MAINNET \| TESTNET`                                                                     | The environment to use when initialising the client. |
| Interval     | `'1M' \| '5M' \| '15M' \| '30M' \| '1H' \| '2H' \| '4H' \| '8H' \| '1D' \| '3D' \| '1W'` | The interval to use when fetching K-line data.       |
| MarginAssets | `USDB`                                                                                   | Symbol values of supported margin assets.            |
| OrderStatus  | `CANCELLED \| EXPIRED \| FILLED \| OPEN \| PENDING \| REJECTED`                          | Defines the possible states an order can be in.      |
| OrderType    | `LIMIT \| LIMIT_MAKER \| MARKET`                                                         | Order types for building order payloads.             |
| TimeInForce  | `GTC \| FOK \| IOC`                                                                      | Time in force values for building order payloads.    |

### Further support

For more detailed information on specific endpoints, please refer to the official [100x API docs](https://100x.readme.io/reference/100x-api-introduction). Each function in this client contains detailed JSDocs on arguments and return types to aid the developer experience as well as links to their respective endpoints within the official docs.

## Contributing

Want to contribute? Check out that [contributing guide](https://github.com/MeanBoyCousin/100xClient/blob/master/CONTRIBUTING.md) to get started.

## Support

Having troubles getting started? Feel free to join us the official [100x Discord server](https://discord.gg/100xdex) where you can get full support from the team.

## License

MIT License © 2024-Present [Tim Dunphy](https://github.com/MeanBoyCousin)
