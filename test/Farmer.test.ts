import { ethers, network, upgrades, waffle } from "hardhat";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
//import { deployContract } from "waffle";
//require("@nomiclabs/hardhat-waffle");

describe("Farmer", function () {
  let accounts: SignerWithAddress[];
  let farmController : Contract;
  let farm : Contract;
  let rewardToken : Contract;
  let stakeToken : Contract;
  let owner : SignerWithAddress;
  let notOwner : SignerWithAddress;
  let notOwner2 : SignerWithAddress;
  const oneToken = ethers.utils.parseUnits("1", 18);
  const tenTokens = ethers.utils.parseUnits("10", 18);
  const rewardTokenstotal = ethers.utils.parseUnits("2", 18);
  const zero = ethers.BigNumber.from("0");
  const justAboveZero = ethers.BigNumber.from("1");

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    notOwner = accounts[1];
    notOwner2 = accounts[2];

    const BonkToken = await ethers.getContractFactory("BonkToken");
    rewardToken = await BonkToken.deploy(
      "BONK Token v2",
      "megaBONK",
      "4000000",
    );
    await rewardToken.deployed();
    await rewardToken.enableTransfers();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    stakeToken = await MockERC20.deploy("WETH/mBONK LP Token", "WETH/mBONK");
    await stakeToken.deployed();
    await stakeToken.getFreeTokens(owner.address, tenTokens);
    await stakeToken.getFreeTokens(notOwner.address, tenTokens);
    await stakeToken.getFreeTokens(notOwner2.address, tenTokens);

    farmController = await (
      await upgrades.deployProxy(
        (await ethers.getContractFactory("FarmController")).connect(owner),
        [rewardToken.address],
        {
          initializer: "initialize(address)",
        },
      )
    ).deployed();

    await farmController.addFarm(stakeToken.address, { gasLimit: 2000000});

    const farmAddr = await farmController.getFarm(0);
    const FarmFactory = await ethers.getContractFactory("LPFarm");
    farm = FarmFactory.attach(farmAddr);

    await farmController.setRates([4]);
    
/*     // Allocate 10% of total supply to the initial farms
    const ownerBalance = await rewardToken.balanceOf(owner.address);
    const INITIAL_REWARDS = ownerBalance.div(10); */

    await rewardToken.approve(farmController.address, rewardTokenstotal);
    await farmController.notifyRewards(rewardTokenstotal);
    
    
  });
/*
  it("Unstaked farm has no rewards", async function () {
    const earnedOwner = await farm.earned(owner.address); 
    const earnedNonOwner = await farm.earned(notOwner.address); 
    const rewardPerToken = await farm.rewardPerToken();
    
    expect(earnedOwner).to.equal(zero);
    expect(earnedNonOwner).to.equal(zero);
    expect(rewardPerToken).to.equal(zero);
  });
  

  it("Unstaked farm gives no rewards", async function () {
    await expect(farm.withdraw(justAboveZero)).to.be.revertedWith('SafeMath: subtraction overflow');
    await expect(farm.exit()).to.be.revertedWith('Cannot withdraw 0');
  });
  */
  it("Withdrawing results in the same balance", async function () {
    const initialBalance = await stakeToken.balanceOf(owner.address);
    await stakeToken.approve(farm.address, oneToken);
    await farm.stake(oneToken);
    const middleBalance = await stakeToken.balanceOf(owner.address);
    await farm.withdraw(oneToken);
    const afterBalance = await stakeToken.balanceOf(owner.address);
    
    expect(initialBalance).to.equal(afterBalance);
    expect(middleBalance).to.equal(afterBalance.sub(oneToken));
  });

  it("Staking gives rewards", async function () {

    console.log('farm balance',  (await rewardToken.balanceOf(farm.address)).toString());
    const initialBalance = await rewardToken.balanceOf(notOwner.address);
    const initialStakeBalance = await stakeToken.balanceOf(notOwner.address);

    await stakeToken.connect(notOwner).approve(farm.address, oneToken);
    await farm.connect(notOwner).stake(oneToken);

     await stakeToken.connect(notOwner2).approve(farm.address, oneToken);
    await farm.connect(notOwner2).stake(oneToken);   

    // Increase time by 1 week
    await network.provider.send("evm_increaseTime", [3550 * 24 * 5]);
    await network.provider.send("evm_mine");

    await farm.connect(notOwner).getReward();
    await farm.connect(notOwner).withdraw(oneToken); 

      await farm.connect(notOwner2).getReward();
    await farm.connect(notOwner2).withdraw(oneToken);   

    console.log('farm balance',  (await rewardToken.balanceOf(farm.address)).toString());
    
    const afterBalance = await rewardToken.balanceOf(notOwner.address);
    const afterOtherBalance = await rewardToken.balanceOf(notOwner2.address);
    const afterStakeBalance = await stakeToken.balanceOf(notOwner.address);

    //console.log('before', initialBalance.toString());
    console.log('after ', afterBalance.toString(), afterOtherBalance.toString());
    // Unsure what should be the exact value
    expect(afterBalance).to.be.above(initialBalance);

    expect(initialStakeBalance).to.equal(afterStakeBalance);
  });

});