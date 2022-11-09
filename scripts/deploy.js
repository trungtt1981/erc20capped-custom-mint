const { ethers } = require('hardhat');

const TOKEN_NAME = 'Tien-Trung Trinh';
const TOKEN_SYMBOL = 'TTT';
const TOKEN_CAP = '1000000';

async function main() {
  const deployingAccount = (await ethers.getSigners())[0];
  const deployingAddress = await deployingAccount.getAddress();
  console.log('deployingAddress:', deployingAddress);

  const ERC20CappedCustom = await ethers.getContractFactory(
    'ERC20CappedCustom'
  );

  const erc20CappedCustomContract = await ERC20CappedCustom.deploy(
    TOKEN_NAME,
    TOKEN_SYMBOL,
    ethers.utils.parseEther(TOKEN_CAP)
  );
  await erc20CappedCustomContract.deployed();
  console.log(
    'ERC20CappedCustom deployed to:',
    erc20CappedCustomContract.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
