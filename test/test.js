const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ERC20CappedCustom: custom mint', () => {
  let owner;
  let user1;
  let user2;
  let user3;
  let user4;
  let erc20CappedCustomContract;
  const TOKEN_NAME = 'Tien-Trung Trinh';
  const TOKEN_SYMBOL = 'TTT';
  const TOKEN_CAP = ethers.utils.parseEther('1000000');
  const user1Amount = ethers.utils.parseEther('10000');
  const user2Amount = ethers.utils.parseEther('200000');
  const user3Amount = ethers.utils.parseEther('200000');
  const user4Amount = ethers.utils.parseEther('30000');

  beforeEach(async () => {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const ERC20CappedCustom = await ethers.getContractFactory(
      'ERC20CappedCustom'
    );

    erc20CappedCustomContract = await ERC20CappedCustom.deploy(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      TOKEN_CAP
    );
    await erc20CappedCustomContract.deployed();
  });

  it('custom mint gets reverted if no total supply', async () => {
    await expect(
      erc20CappedCustomContract.connect(owner).customMintAll()
    ).to.revertedWith('Total supply is zero');
  });

  it('mint and custom mint gets reverted if caller is not the owner', async () => {
    await expect(
      erc20CappedCustomContract.connect(user1).mint(user2.address, user2Amount)
    ).to.revertedWith('Ownable: caller is not the owner');

    await erc20CappedCustomContract
      .connect(owner)
      .mint(user1.address, user1Amount);

    await expect(
      erc20CappedCustomContract.connect(user1).customMintAll()
    ).to.revertedWith('Ownable: caller is not the owner');
  });

  it('customMintAll should work fine', async () => {
    await erc20CappedCustomContract
      .connect(owner)
      .mint(user1.address, user1Amount);

    await erc20CappedCustomContract
      .connect(owner)
      .mint(user2.address, user2Amount);

    await erc20CappedCustomContract
      .connect(owner)
      .mint(user3.address, user3Amount);

    await erc20CappedCustomContract
      .connect(user3)
      .transfer(user4.address, user4Amount);

    await erc20CappedCustomContract.connect(owner).customMintAll();
  });
});
