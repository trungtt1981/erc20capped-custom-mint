// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20CappedCustom is ERC20Capped, Ownable {
    // Store the list of token holders
    address[] public tokenHolderList;

    // Check if tokenHolder is already added in the "tokenHolderList"
    mapping(address => bool) public tokenHolderAdded;

    uint256 public mintPercent = 20;

    event EvtSetMintPercent(uint256 mintPercent);
    event EvtCustomMintAll(uint256 totalAccountsMinted, uint256 totalAmountMinted);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 cap_
    ) ERC20Capped(cap_) ERC20(name_, symbol_) {}

    // If the userWallet is not address zero and not yet added, it will be added into the tokenHolderList
    function _checkToAddTokenHolder(address userWallet_) private {
        if (userWallet_ != address(0) && !tokenHolderAdded[userWallet_]) {
            tokenHolderAdded[userWallet_] = true;
            tokenHolderList.push(userWallet_);
        }
    }

    function _afterTokenTransfer(
        address from_,
        address to_,
        uint256 amount_
    ) internal override {
        amount_; // avoid warning
        _checkToAddTokenHolder(from_);
        _checkToAddTokenHolder(to_);
    }

    function setMintPercent(uint256 mintPercent_) external onlyOwner {
        require(mintPercent_ > 0, "Invalid mintPercent");
        mintPercent = mintPercent_;
        emit EvtSetMintPercent(mintPercent_);
    }

    function mint(address to_, uint256 amount_) external onlyOwner {
        require(to_ != address(0), "Invalid receiving address");
        require(amount_ > 0, "Invalid receiving amount");
        _mint(to_, amount_);
    }

    // Subject to gas limit and thus can be reverted
    function customMintAll() external onlyOwner {
        require(totalSupply() > 0, "Total supply is zero");

        uint256 mintAmount = (mintPercent * totalSupply()) / 100;

        uint256 totalAmountMinted = 0;
        uint256 totalAccountsMinted = 0;
        for (uint256 i = 0; i < tokenHolderList.length; i++) {
            address account = tokenHolderList[i];
            uint256 amount = (mintPercent * balanceOf(account)) / 100;
            if (amount > 0) {
                _mint(account, amount);
                totalAmountMinted += amount;
                totalAccountsMinted++;
            }
        }

        // Final check the totally-minted amount and accounts
        require(
            totalAmountMinted == mintAmount,
            "Totally-minted amount different from the expected mint amount"
        );
        require(
            totalAccountsMinted <= tokenHolderList.length,
            "Totally-minted accounts exceeds the total token holder list"
        );

        emit EvtCustomMintAll(totalAccountsMinted, totalAmountMinted);
    }
}
