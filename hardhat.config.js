require('@typechain/hardhat');
require('@nomiclabs/hardhat-ethers');
require('hardhat-gas-reporter');
require('hardhat-contract-sizer');
require('@nomiclabs/hardhat-waffle');

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.15',
        parser: 'solcjs',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  gasReporter: {
    enabled: true,
  },
};
