# ERC20Capped With Custom Mint Smart Contract

In a solidity token contract that inherits ERC20Capped.
Please provide a function that mints 20% of the total supply
and distributes (transfer) to all holders of the contract proportionally
to the amount of tokens they hold at the blocktime that the mint occurs.
This function can be callable externally.

2 functions are provided to do the job:

- `function customMintAll()`: subject to gas limit by the for-loop and thus can be reverted

- `function customMintFromTo(uint256 fromIndex_, uint256 toIndex_)`: to avoid gas limit, we pass in the controlled "fromIndex" and "toIndex" of the token holder list

## Installation

`yarn`

## Compile contracts

`yarn compile`

## Run unit-test

`yarn test`

## Deploy contract to Hardhat

`yarn deploy-hardhat`
