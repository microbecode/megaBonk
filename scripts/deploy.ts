import { ethers, network, artifacts, upgrades } from "hardhat";
import * as fs from "fs";
import { Contract } from "ethers";

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

  const BonkTokenOld = await ethers.getContractFactory("BonkTokenOld");
  const bonkTokenOld = await BonkTokenOld.deploy();
  await bonkTokenOld.deployed();
  console.log("BonkTokenOld address:", bonkTokenOld.address);

  // get some free tokens for testing
  const OLD_INIT_SUPPLY = ethers.utils.parseUnits("3000", 18);
  await bonkTokenOld.getFreeTokens(OLD_INIT_SUPPLY);
  // await bonkTokenOld.transfer("0x...", OLD_INIT_SUPPLY.div(2)); // todo: hardcoded address

  const BonkToken = await ethers.getContractFactory("BonkToken");
  const bonkToken = await BonkToken.deploy(
    "BONK Token v2",
    "megaBONK",
    "4000000",
  );
  await bonkToken.deployed();
  console.log("BonkToken address:", bonkToken.address);

  const BonkMigrator = await ethers.getContractFactory("BonkMigrator");
  const bonkMigrator = await BonkMigrator.deploy(
    bonkTokenOld.address,
    bonkToken.address,
  );
  await bonkMigrator.deployed();
  console.log("BonkMigrator address:", bonkMigrator.address);

  // Enable transfers
  await bonkToken.enableTransfers();
  const sendToMigrator = await bonkToken.balanceOf(owner);
  await bonkToken.transfer(bonkMigrator.address, sendToMigrator);

  // NFT minter
  const MINT_FEE = ethers.utils.parseUnits("1", 18); // 1 BONK fee

  const BonkNftMinter = await ethers.getContractFactory("BonkNftMinter");
  const bonkNftMinter = await BonkNftMinter.deploy(
    "Bonk NFT Minter",
    "BONK NFT",
    bonkTokenOld.address,
    owner,
    MINT_FEE,
  );
  await bonkNftMinter.deployed();
  console.log("BonkNftMinter address:", bonkNftMinter.address);

  await bonkNftMinter.setBonkToken(bonkToken.address);
  const NEW_FEE = ethers.utils.parseUnits("99", 16); // 0.99 BONK fee
  await bonkNftMinter.setBonkFee(NEW_FEE);

  // Deploy staking contracts
  const MockERC20 = await ethers.getContractFactory("MockERC20");

  const token1 = await MockERC20.deploy("WETH/mBONK LP Token", "WETH/mBONK");
  await token1.deployed();
  console.log("token1 address:", token1.address);

  const token2 = await MockERC20.deploy("BONK/mBONK LP Token", "BONK/mBONK");
  await token2.deployed();
  console.log("token2 address:", token2.address);

  const token3 = await MockERC20.deploy("USDC/mBONK LP Token", "USDC/mBONK");
  await token3.deployed();
  console.log("token3 address:", token3.address);

  const token4 = await MockERC20.deploy("YFL/mBONK LP Token", "YFL/mBONK");
  await token4.deployed();
  console.log("token4 address:", token4.address);

  const token5 = await MockERC20.deploy("wBTC/mBONK LP Token", "wBTC/mBONK");
  await token5.deployed();
  console.log("token5 address:", token5.address);

  // deploy FarmController
  const farmController = await (
    await upgrades.deployProxy(
      (await ethers.getContractFactory("FarmController")).connect(deployer),
      [bonkToken.address],
      {
        initializer: "initialize(address)",
      },
    )
  ).deployed();
  console.log("FarmController deployed to:", farmController.address);

  await farmController.addFarm(token1.address, { gasLimit: 2000000} );
  await farmController.addFarm(token2.address, { gasLimit: 2000000});
  await farmController.addFarm(token3.address, { gasLimit: 2000000});
  await farmController.addFarm(token4.address, { gasLimit: 2000000});
  await farmController.addFarm(token5.address, { gasLimit: 2000000});

  await farmController.setRates([3, 3, 2, 1, 1]);
  //
  // Allocate 10% of total supply to the initial farms
  const ownerBalance = await bonkToken.balanceOf(owner);
  const INITIAL_REWARDS = ownerBalance.div(10);
  console.log(
    "Balance, INITIAL_REWARDS:",
    ownerBalance.toString(),
    INITIAL_REWARDS.toString(),
  );
  await bonkToken.approve(farmController.address, INITIAL_REWARDS);
  await farmController.notifyRewards(INITIAL_REWARDS);

  console.log("DONE");

  // We also save the contract artifacts and addresses in the frontend directory
  saveFrontendFiles(
    bonkTokenOld,
    bonkToken,
    bonkMigrator,
    bonkNftMinter,
    token1,
    token2,
    token3,
    token4,
    token5,
    farmController,
  );
}

function saveFrontendFiles(
  bonkTokenOld: Contract,
  bonkToken: Contract,
  bonkMigrator: Contract,
  bonkNftMinter: Contract,
  token1: Contract,
  token2: Contract,
  token3: Contract,
  token4: Contract,
  token5: Contract,
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
        BonkTokenOld: bonkTokenOld.address,
        BonkToken: bonkToken.address,
        BonkMigrator: bonkMigrator.address,
        BonkNftMinter: bonkNftMinter.address,
        Token1: token1.address,
        Token2: token2.address,
        Token3: token3.address,
        Token4: token4.address,
        Token5: token5.address,
        FarmController: farmController.address,
      },
      undefined,
      2,
    ),
  );

  const BonkTokenOldArtifact = artifacts.readArtifactSync("BonkTokenOld");
  const BonkTokenArtifact = artifacts.readArtifactSync("BonkToken");
  const BonkMigratorArtifact = artifacts.readArtifactSync("BonkMigrator");

  const BonkNftMinterArtifact = artifacts.readArtifactSync("BonkNftMinter");

  const MockERC20Artifact = artifacts.readArtifactSync("MockERC20");
  const FarmControllerArtifact = artifacts.readArtifactSync("FarmController");
  const LPFarmArtifact = artifacts.readArtifactSync("LPFarm");

  fs.writeFileSync(
    contractsDir + "/BonkTokenOld.json",
    JSON.stringify(BonkTokenOldArtifact, null, 2),
  );
  fs.writeFileSync(
    contractsDir + "/BonkToken.json",
    JSON.stringify(BonkTokenArtifact, null, 2),
  );
  fs.writeFileSync(
    contractsDir + "/BonkMigrator.json",
    JSON.stringify(BonkMigratorArtifact, null, 2),
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
