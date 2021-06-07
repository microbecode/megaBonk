import { ethers, upgrades, waffle } from "hardhat";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
//import { deployContract } from "waffle";
//require("@nomiclabs/hardhat-waffle");

describe("Farmer", function () {
  let accounts: SignerWithAddress[];
  let farm : Contract;
  let owner : SignerWithAddress;
  let notOwner : SignerWithAddress;
  const oneToken = ethers.utils.parseUnits("1", 18);
  const zero = ethers.BigNumber.from("0");

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

    const farmAddr = await farmController.getFarm(0);
    const FarmFactory = await ethers.getContractFactory("LPFarm");
    farm = FarmFactory.attach(farmAddr);

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

  it("Empty farm", async function () {
    const earnedOwner = await farm.earned(owner.address); 
    const earnedNonOwner = await farm.earned(notOwner.address); 
    const rewardPerToken = await farm.rewardPerToken();
    
    expect(earnedOwner).to.equal(zero);
    expect(earnedNonOwner).to.equal(zero);
    expect(rewardPerToken).to.equal(zero);
  });

});