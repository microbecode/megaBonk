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

    const contrFactory = await ethers.getContractFactory("FarmController");
    farmController = await contrFactory.deploy(rewardToken.address);
    await farmController.deployed();
    
    await farmController.addFarm(stakeToken.address, { gasLimit: 2000000});

    const farmAddr = await farmController.getFarm(0);
    const FarmFactory = await ethers.getContractFactory("LPFarm");
    farm = FarmFactory.attach(farmAddr);

    await farmController.setRates([1]);
    
/*     // Allocate 10% of total supply to the initial farms
    const ownerBalance = await rewardToken.balanceOf(owner.address);
    const INITIAL_REWARDS = ownerBalance.div(10); */

    await rewardToken.approve(farmController.address, rewardTokenstotal);
    
    
    
  });

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

  // Two participants in the same farm, with the same stake
  it("Staking gives rewards to two participants", async function () {
    await farmController.notifyRewards(rewardTokenstotal);

    //console.log('farm balance',  (await rewardToken.balanceOf(farm.address)).toString());
    const initialBalance = await rewardToken.balanceOf(notOwner.address);
    const initialStakeBalance = await stakeToken.balanceOf(notOwner.address);

    await stakeToken.connect(notOwner).approve(farm.address, oneToken);
    await farm.connect(notOwner).stake(oneToken);

    await stakeToken.connect(notOwner2).approve(farm.address, oneToken);
    await farm.connect(notOwner2).stake(oneToken);   

    // Increase time by almost 1 week
    await network.provider.send("evm_increaseTime", [3550 * 24 * 7]);
    await network.provider.send("evm_mine");

    await farm.connect(notOwner).getReward();
    await farm.connect(notOwner).withdraw(oneToken); 

    await farm.connect(notOwner2).getReward();
    await farm.connect(notOwner2).withdraw(oneToken);   

    //console.log('farm balance',  (await rewardToken.balanceOf(farm.address)).toString());
    
    const afterBalance = await rewardToken.balanceOf(notOwner.address);
    const afterOtherBalance = await rewardToken.balanceOf(notOwner2.address);
    const afterStakeBalance = await stakeToken.balanceOf(notOwner.address);

    //console.log('before', initialBalance.toString());
    //console.log('after ', afterBalance.toString(), afterOtherBalance.toString());

    expect(afterBalance).to.be.above(initialBalance);
    expect(initialStakeBalance).to.equal(afterStakeBalance);

    const precision = 1e13; // remove some precision from numbers
    // make sure both participants get the same amount
    expect(afterOtherBalance.div(precision)).to.equal(afterBalance.div(precision));
  });

  // Two participants, each in his own farm. Farms are set to have equal reward rates.
  it("Two farms give equal rewards", async function () {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const stakeToken2 = await MockERC20.deploy("blah", "bleh");
    await stakeToken2.deployed();
    await stakeToken2.getFreeTokens(notOwner2.address, tenTokens);

    await farmController.addFarm(stakeToken2.address, { gasLimit: 2000000});
    await farmController.setRates([1, 1]);

    const farm2Addr = await farmController.getFarm(1);
    const FarmFactory = await ethers.getContractFactory("LPFarm");
    const farm2 = FarmFactory.attach(farm2Addr);

    await rewardToken.approve(farmController.address, rewardTokenstotal);
    await farmController.notifyRewards(rewardTokenstotal);


    //console.log('farm balance',  (await rewardToken.balanceOf(farm.address)).toString());
    const initialBalance = await rewardToken.balanceOf(notOwner.address);
    const initialBalance2 = await rewardToken.balanceOf(notOwner2.address);

    await stakeToken.connect(notOwner).approve(farm.address, oneToken);
    await farm.connect(notOwner).stake(oneToken);

    await stakeToken2.connect(notOwner2).approve(farm2.address, oneToken);
    await farm2.connect(notOwner2).stake(oneToken);

    // Increase time by almost 1 week
    await network.provider.send("evm_increaseTime", [3550 * 24 * 7]);
    await network.provider.send("evm_mine");

    await farm.connect(notOwner).getReward();
    await farm.connect(notOwner).withdraw(oneToken); 

    await farm2.connect(notOwner2).getReward();
    await farm2.connect(notOwner2).withdraw(oneToken); 

    //console.log('farm balance',  (await rewardToken.balanceOf(farm.address)).toString());
    
    const afterBalance = await rewardToken.balanceOf(notOwner.address);
    const afterOtherBalance = await rewardToken.balanceOf(notOwner2.address);

    //console.log('before', initialBalance.toString());
    console.log('after ', afterBalance.toString(), afterOtherBalance.toString());

    expect(afterBalance).to.be.above(initialBalance);
    expect(afterOtherBalance).to.be.above(initialBalance2);

    // make sure both participants get the same amount
    expect(afterOtherBalance).to.equal(afterBalance);
  });
});