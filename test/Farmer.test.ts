import { ethers, upgrades, waffle } from "hardhat";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
//import { deployContract } from "waffle";
//require("@nomiclabs/hardhat-waffle");

describe("Farmer", function () {
  let accounts: SignerWithAddress[];
  let minter : Contract;
  let token : Contract;
  let owner : SignerWithAddress;
  let notOwner : SignerWithAddress;
  const oneToken = ethers.utils.parseUnits("1", 18);

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    owner = accounts[0];

    const BonkToken = await ethers.getContractFactory("BonkToken");
    const bonkToken = await BonkToken.deploy(
      "BONK Token v2",
      "megaBONK",
      "4000000",
    );
    await bonkToken.deployed();
    await bonkToken.enableTransfers();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token1 = await MockERC20.deploy("WETH/mBONK LP Token", "WETH/mBONK");
    await token1.deployed();

    const farmController = await (
      await upgrades.deployProxy(
        (await ethers.getContractFactory("FarmController")).connect(owner),
        [bonkToken.address],
        {
          initializer: "initialize(address)",
        },
      )
    ).deployed();

    await farmController.addFarm(token1.address, { gasLimit: 2000000});
    await farmController.setRates([3]);
    
    // Allocate 10% of total supply to the initial farms
    const ownerBalance = await bonkToken.balanceOf(owner.address);
    const INITIAL_REWARDS = ownerBalance.div(10);
    console.log(
      "Balance, INITIAL_REWARDS:",
      ownerBalance.toString(),
      INITIAL_REWARDS.toString(),
    );
    await bonkToken.approve(farmController.address, INITIAL_REWARDS);
    await farmController.notifyRewards(INITIAL_REWARDS);
    
    notOwner = accounts[1];
  });

  it("hmm", async function () {
/*     const tokenBalanceBefore = await token.balanceOf(owner);
    await token.transferAndCall(
      minter.address,
      oneToken,
      payload
    );
    const tokenBalanceAfter = await token.balanceOf(owner);
    expect(tokenBalanceAfter).to.equal(tokenBalanceBefore.sub(oneToken)); */
  });

});