import { ethers, network, upgrades, waffle } from "hardhat";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
//import { deployContract } from "waffle";
//require("@nomiclabs/hardhat-waffle");

describe("Farmer", function () {
  let accounts: SignerWithAddress[];
  let farm : Contract;
  let rewardToken : Contract;
  let owner : SignerWithAddress;
  let notOwner : SignerWithAddress;
  const oneToken = ethers.utils.parseUnits("1", 18);
  const tenTokens = ethers.utils.parseUnits("10", 18);
  const zero = ethers.BigNumber.from("0");
  const justAboveZero = ethers.BigNumber.from("1");

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    owner = accounts[0];

    const BonkToken = await ethers.getContractFactory("BonkToken");
    rewardToken = await BonkToken.deploy(
      "BONK Token v2",
      "megaBONK",
      "4000000",
    );
    await rewardToken.deployed();
    await rewardToken.enableTransfers();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token1 = await MockERC20.deploy("WETH/mBONK LP Token", "WETH/mBONK");
    await token1.deployed();
    await token1.getFreeTokens(owner.address, tenTokens);

    const farmController = await (
      await upgrades.deployProxy(
        (await ethers.getContractFactory("FarmController")).connect(owner),
        [rewardToken.address],
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
    const ownerBalance = await rewardToken.balanceOf(owner.address);
    const INITIAL_REWARDS = ownerBalance.div(10);
    console.log(
      "Balance, INITIAL_REWARDS:",
      ownerBalance.toString(),
      INITIAL_REWARDS.toString(),
    );
    await rewardToken.approve(farmController.address, INITIAL_REWARDS);
    await farmController.notifyRewards(INITIAL_REWARDS);
    
    notOwner = accounts[1];
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
  it("Can withdraw", async function () {
    const initialBalance = await rewardToken.balanceOf(owner.address);
    console.log('balan', initialBalance.toString())
    console.log('staking', oneToken.toString())
    await farm.stake(oneToken);
    const middleBalance = await rewardToken.balanceOf(owner.address);
    await farm.withdraw(oneToken);
    const afterBalance = await rewardToken.balanceOf(owner.address);
    
    expect(initialBalance).to.equal(afterBalance);
    expect(middleBalance).to.equal(afterBalance.sub(oneToken));
  });

  it("Can withdraw", async function () {
    

    await network.provider.send("evm_increaseTime", [3600])
    await network.provider.send("evm_mine") // this one will have 02:00 PM as its timestamp

/*     const time = now + 86400
await ethers.provider.send('evm_setNextBlockTimestamp', [time]); 
await ethers.provider.send('evm_mine'); */
    /*
    const initialBalance = await rewardToken.balanceOf(owner.address);
    await farm.withdraw(justAboveZero);
    const afterBalance = await rewardToken.balanceOf(owner.address);
    expect(initialBalance).to.equal(afterBalance);
*/
  });

});