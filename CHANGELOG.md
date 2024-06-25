# 100x Client SDK

## 1.0.0

- V1 release with all REST endpoints.
- Added README.
- Added contributing guidelines.

## 1.0.1

- Updated README.
- Updated release workflow for better ordering.

## 1.0.2

- Added missing entry points to package.json.
- Tweaks to the TypeScript config.
- Updated various docs.

## 1.0.3

- Change log updates are now checked during PR CI runs.
- Change log notes are now appended to releases.
- Added `tsx` as a missing dev dependency.
- Users can now hot swap between sub-accounts.

## 1.1.0

- Scripts and dev dependencies are now cleaned from package.json before building the package.
- README updates.
- Mainnet contracts now up to date.
- No longer mocking contract addresses and API URL.

## 1.1.1

- The `placeOrder` method now takes a `priceIncrement` parameter for market orders to ensure correct precision when slippage is applied.
- Nonces are now generated in microsecond time instead of nanosecond time.

## 1.2.0

- New `trade-history` endpoint added via the `getTradeHistory` method.
- Fixed a typo in the unknown error message and moved it to a constant for better reusability.
