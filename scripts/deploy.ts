import { ethers, network, artifacts, upgrades } from "hardhat";
import * as fs from "fs";
import { BigNumber, Contract } from "ethers";
const hre = require("hardhat");

const clientAddr = "0xfAc9b97001E71CAAaA04976cd0CC816769878DDD"; // client address in ropsten
let farm1StakeAddr = "0xdAd35387c2212f4E7d869102bBF881adB2915dCB"; // mBonk in mainnet
let farm2StakeAddr = "0x0f6a0e93a471db618e2ec4aced1daa3c825b04f2"; // LP token in mainnet
let farmRewardAddr = "0xdAd35387c2212f4E7d869102bBF881adB2915dCB"; // mBonk in mainnet
let minterAddr = "0xaC25E9CD6472b4D723464b468A130B132d290221" // NFT minter in mainnet
const tenTokens = ethers.utils.parseUnits("10", 18);
let farmTotalRewardAmount = ethers.utils.parseUnits("400000", 18);;

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'",
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress(),
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // set init params
  const owner = await deployer.getAddress();

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const MINT_FEE = ethers.utils.parseUnits("1", 18); // 1 BONK fee

  const needRedeploy = network.name == 'ropsten' || network.name == 'hardhat' || network.name == 'localhost';

  if (needRedeploy) {
    const BonkToken = await ethers.getContractFactory("BonkToken");
    const rewardToken = await BonkToken.deploy(
      "BONK Token v2",
      "megaBONK",
      "4000000"
    );
    await rewardToken.deployed();
    farmRewardAddr = rewardToken.address;
    console.log("BonkToken (reward token) address:", rewardToken.address);
  
    // Enable transfers
    await rewardToken.enableTransfers();

    // NFT minter
    
  }

  const bonkNftMinterArgs = [
    "Bonk NFT Minter",
    "BONK NFT",
    farmRewardAddr,
    farmRewardAddr, // just set the fee receiver to be anything else than the owner
    MINT_FEE,
  ];

  if (needRedeploy) {
    const BonkNftMinter = await ethers.getContractFactory("BonkNftMinter");
    const bonkNftMinter = await BonkNftMinter.deploy(...bonkNftMinterArgs);
    await bonkNftMinter.deployed();
    console.log("BonkNftMinter address:", bonkNftMinter.address);
    minterAddr = bonkNftMinter.address;

    await bonkNftMinter.setBonkToken(farmRewardAddr);
    const NEW_FEE = ethers.utils.parseUnits("99", 16); // 0.99 BONK fee
    await bonkNftMinter.setBonkFee(NEW_FEE);

    // Deploy other for staking

    const stakeToken2 = await MockERC20.deploy("Wannabe-LPtoken", "LP");
    await stakeToken2.deployed();
    await stakeToken2.getFreeTokens(clientAddr, tenTokens);
    await stakeToken2.getFreeTokens(owner, tenTokens);

    console.log("stakeToken1 address:", farmRewardAddr, "stakeToken2 address:", stakeToken2.address);

    farm1StakeAddr = farmRewardAddr;
    farm2StakeAddr = stakeToken2.address;
  }



  // deploy FarmController
  const contrFactory = await ethers.getContractFactory("FarmController");
  const farmController = await contrFactory.deploy(farmRewardAddr)
  await farmController.deployed();
  console.log("FarmController deployed to:", farmController.address);

  const farm1Tx = await farmController.addFarm(farm1StakeAddr, { gasLimit: 2000000} );
  await farm1Tx.wait();

  const farm2Tx = await farmController.addFarm(farm2StakeAddr, { gasLimit: 2000000} );
  await farm2Tx.wait();
  
  console.log('count', ( await farmController.getFarmsCount()).toString());  
  const farm1Addr = await farmController.getFarm(0);
  const farm2Addr = await farmController.getFarm(1);
  console.log('Farm1 deployed to:', farm1Addr, ' farm2 deployed to:', farm2Addr);

  await farmController.setRates([1, 1]);

  const farmRewardToken = await MockERC20.attach(farmRewardAddr);
  await farmRewardToken.approve(farmController.address, farmTotalRewardAmount);
  await farmController.notifyRewards(farmTotalRewardAmount);

  await farmController.transferOwnership(clientAddr);

  console.log("Deployments are ready");

  // We also save the contract artifacts and addresses in the frontend directory
  await saveFrontendFiles(
    farmRewardAddr,
    minterAddr,
    farmController.address,
    farm1StakeAddr,
    farm2StakeAddr,
    farm1Addr,
    farm2Addr
  );

  await verifyContracts(
    farmRewardAddr,
    minterAddr,
    farmController.address,
    farm2StakeAddr,
    farm1Addr,
    farm2Addr,
    bonkNftMinterArgs
  );

  console.log('all done')
}

async function saveFrontendFiles(
  rewardTokenAddr: string,
  bonkNftMinterAddr: string,
  farmControllerAddr: string, 
  farm1StakeAddr: string,
  farm2StakeAddr: string,
  farm1Addr: string,
  farm2Addr: string
) {
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(
      {
        BonkToken: rewardTokenAddr,
        BonkNftMinter: bonkNftMinterAddr, 
        Farm1StakeToken: farm1StakeAddr,
        Farm2StakeToken: farm2StakeAddr,
        Farm1: farm1Addr,
        Farm2: farm2Addr,
        FarmController: farmControllerAddr
      },
      undefined,
      2,
    ),
  );

  const BonkTokenArtifact = artifacts.readArtifactSync("BonkToken");
  const BonkNftMinterArtifact = artifacts.readArtifactSync("BonkNftMinter");
  const MockERC20Artifact = artifacts.readArtifactSync("MockERC20");
  const FarmControllerArtifact = artifacts.readArtifactSync("FarmController");
  const LPFarmArtifact = artifacts.readArtifactSync("LPFarm"); 

  fs.writeFileSync(
    contractsDir + "/BonkToken.json",
    JSON.stringify(BonkTokenArtifact, null, 2),
  );
  fs.writeFileSync(
    contractsDir + "/BonkNftMinter.json",
    JSON.stringify(BonkNftMinterArtifact, null, 2),
  );
  fs.writeFileSync(
    contractsDir + "/MockERC20Artifact.json",
    JSON.stringify(MockERC20Artifact, null, 2),
  );
  fs.writeFileSync(
    contractsDir + "/FarmControllerArtifact.json",
    JSON.stringify(FarmControllerArtifact, null, 2),
  );
  fs.writeFileSync(
    contractsDir + "/LPFarm.json",
    JSON.stringify(LPFarmArtifact, null, 2),
  );
}

const verifyContracts = async (
  rewardTokenAddr: string,
  bonkNftMinterAddr: string,
  farmControllerAddr: string, 
  farm2StakeAddr: string,
  farm1Addr: string,
  farm2Addr: string,
  bonkNftMinterArgs: (string | BigNumber)[]
/*   bonkNftMinter: Contract,
  ,
  farmController: Contract,
  stakeToken : Contract,
  rewardToken: Contract,
  farmAddr: string */
) => {
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log('Waiting for the contracts to be distributed in Etherscan...')
    
    await delay(30000); 
    
    await hre.run("verify:verify", {
      address: bonkNftMinterAddr,
      constructorArguments: bonkNftMinterArgs,
    });  


    await hre.run("verify:verify", {
      address: rewardTokenAddr,
      constructorArguments: ["BONK Token v2", "megaBONK", "4000000"]
    });   

    await hre.run("verify:verify", {
      address: farm2StakeAddr,
      constructorArguments: ["Wannabe-LPtoken", "LP"]
    }); 
 
    await hre.run("verify:verify", {
      address: farm1Addr,
      constructorArguments: []
    });  

    await hre.run("verify:verify", {
      address: farm2Addr,
      constructorArguments: []
    });

    await hre.run("verify:verify", {
      address: farmControllerAddr,
      constructorArguments: [rewardTokenAddr]
    });   
    console.log('Verification done');
    
  }
}

const delay = (ms : number) => new Promise(res => setTimeout(res, ms));
  


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
