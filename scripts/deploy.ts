import { ethers, network, artifacts, upgrades } from "hardhat";
import * as fs from "fs";
import { BigNumber, Contract } from "ethers";
const hre = require("hardhat");
const clientAddr = "0xfAc9b97001E71CAAaA04976cd0CC816769878DDD";

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

  const BonkToken = await ethers.getContractFactory("BonkToken");
  const rewardToken = await BonkToken.deploy(
    "BONK Token v2",
    "megaBONK",
    "4000000"
  );
  await rewardToken.deployed();
  console.log("BonkToken (reward token) address:", rewardToken.address);

  // Enable transfers
  await rewardToken.enableTransfers();

  // NFT minter
  const MINT_FEE = ethers.utils.parseUnits("1", 18); // 1 BONK fee

  const bonkNftMinterArgs = [
    "Bonk NFT Minter",
    "BONK NFT",
    rewardToken.address,
    rewardToken.address, // just set the fee receiver to be anything else than the owner
    MINT_FEE,
  ];

  const BonkNftMinter = await ethers.getContractFactory("BonkNftMinter");
  const bonkNftMinter = await BonkNftMinter.deploy(...bonkNftMinterArgs);
  await bonkNftMinter.deployed();
  console.log("BonkNftMinter address:", bonkNftMinter.address);

  await bonkNftMinter.setBonkToken(rewardToken.address);
  const NEW_FEE = ethers.utils.parseUnits("99", 16); // 0.99 BONK fee
  await bonkNftMinter.setBonkFee(NEW_FEE);

  
  // Deploy staking contracts
  const MockERC20 = await ethers.getContractFactory("MockERC20");

  const stakeToken = await MockERC20.deploy("Othertoken", "OT");
  await stakeToken.deployed();
  const tenTokens = ethers.utils.parseUnits("10", 18);
  await stakeToken.getFreeTokens(clientAddr, tenTokens);
  console.log("stakeToken address:", stakeToken.address);

/*   const token2 = await MockERC20.deploy("BONK/mBONK LP Token", "BONK/mBONK");
  await token2.deployed();
  console.log("token2 address:", token2.address); */

/*   const token3 = await MockERC20.deploy("USDC/mBONK LP Token", "USDC/mBONK");
  await token3.deployed();
  console.log("token3 address:", token3.address);

  const token4 = await MockERC20.deploy("YFL/mBONK LP Token", "YFL/mBONK");
  await token4.deployed();
  console.log("token4 address:", token4.address);

  const token5 = await MockERC20.deploy("wBTC/mBONK LP Token", "wBTC/mBONK");
  await token5.deployed();
  console.log("token5 address:", token5.address); */

  // deploy FarmController
  const contrFactory = await ethers.getContractFactory("FarmController");
  const farmController = await contrFactory.deploy(rewardToken.address)
  await farmController.deployed();
  console.log("FarmController deployed to:", farmController.address);

  await farmController.addFarm(rewardToken.address, { gasLimit: 2000000} );
  if (network.name === "Ropsten") {
    await delay(60000); // Unsure why this is needed for Ropsten - locally everything works fine
  }
  
  console.log('count', ( await farmController.getFarmsCount()).toString());  
  const farmAddr = await farmController.getFarm(0);
  console.log('Farm deployed to:', farmAddr);

 /* await farmController.addFarm(token2.address, { gasLimit: 2000000});
  await farmController.addFarm(token3.address, { gasLimit: 2000000});
  await farmController.addFarm(token4.address, { gasLimit: 2000000});
  await farmController.addFarm(token5.address, { gasLimit: 2000000}); 

  await farmController.setRates([1, 1]);
  //
  // Allocate 10% of total supply to the initial farms
  const ownerBalance = await rewardToken.balanceOf(owner);
  const INITIAL_REWARDS = ownerBalance.div(10);
  console.log(
    "Balance, INITIAL_REWARDS:",
    ownerBalance.toString(),
    INITIAL_REWARDS.toString(),
  );
  await rewardToken.approve(farmController.address, INITIAL_REWARDS);
  await farmController.notifyRewards(INITIAL_REWARDS);

  console.log("DONE");*/

  await farmController.transferOwnership(clientAddr);

  // We also save the contract artifacts and addresses in the frontend directory
  await saveFrontendFiles(
    rewardToken,
    bonkNftMinter,
    stakeToken,
/*    token2,
    token3,
    token4,
    token5,  */
    farmController
  );

  await verifyContracts(bonkNftMinter, bonkNftMinterArgs, farmController, stakeToken, rewardToken, farmAddr);

  console.log('all done')
}

async function saveFrontendFiles(
  rewardToken: Contract,
  bonkNftMinter: Contract,
  stakeToken: Contract,
/* token2: Contract,
   token3: Contract,
  token4: Contract,
  token5: Contract, */
  farmController: Contract, 
) {
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(
      {
        BonkToken: rewardToken.address,
        BonkNftMinter: bonkNftMinter.address, 
        stakeToken: stakeToken.address,
 /*       Token2: token2.address,
         Token3: token3.address,
        Token4: token4.address,
        Token5: token5.address, */
        FarmController: farmController.address
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
  bonkNftMinter: Contract,
  bonkNftMinterArgs: (string | BigNumber)[],
  farmController: Contract,
  stakeToken : Contract,
  rewardToken: Contract,
  farmAddr: string
) => {
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log('Waiting for the contract to be distributed in Etherscan...')
    
    await delay(30000); 
    
    await hre.run("verify:verify", {
      address: bonkNftMinter.address,
      constructorArguments: bonkNftMinterArgs,
    });  

    console.log('verified 1');

    await hre.run("verify:verify", {
      address: rewardToken.address,
      constructorArguments: ["BONK Token v2", "megaBONK", "4000000"]
    });   
    console.log('verified 2');
    await hre.run("verify:verify", {
      address: stakeToken.address,
      constructorArguments: ["Othertoken", "OT"]
    }); 
    console.log('verified 3');
    await hre.run("verify:verify", {
      address: farmAddr,
      constructorArguments: []
    });  
    console.log('verified 4');
    await hre.run("verify:verify", {
      address: farmController.address,
      constructorArguments: [rewardToken.address]
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
