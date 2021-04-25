import { ethers, waffle } from "hardhat";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
//import { deployContract } from "waffle";
//require("@nomiclabs/hardhat-waffle");

describe("NFT minting", function () {
  let accounts: SignerWithAddress[];
  let minter : Contract;
  let token : Contract;
  let owner : string;
  let notOwner : SignerWithAddress;
  const oneToken = ethers.utils.parseUnits("1", 18);

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    const BonkToken = await ethers.getContractFactory("BonkToken");
    token = await BonkToken.deploy(
      "BONK Token v2",
      "megaBONK",
      "4000000",
    );
    await token.deployed();
    await token.enableTransfers();
  
    const MINT_FEE = ethers.utils.parseUnits("1", 18); // 1 BONK fee
    const BonkNftMinter = await ethers.getContractFactory("BonkNftMinter");
    minter = await BonkNftMinter.deploy(
      "Bonk NFT Minter",
      "BONK NFT",
      token.address,
      token.address, // just set the fee receiver to be anything else than the owner
      MINT_FEE,
    );
    await minter.deployed();

    owner = accounts[0].address;
    notOwner = accounts[1];
  });

  const rawPayload = "hello";
  const payload = ethers.utils.toUtf8Bytes(rawPayload);

  it("should decrease token balance", async function () {
    const tokenBalanceBefore = await token.balanceOf(owner);
    await token.transferAndCall(
      minter.address,
      oneToken,
      payload
    );
    const tokenBalanceAfter = await token.balanceOf(owner);
    expect(tokenBalanceAfter).to.equal(tokenBalanceBefore.sub(oneToken));
  });

  it("should decrease custom token balance", async function () {
    const threeTokens = ethers.utils.parseUnits("3", 18);
    const tokenBalanceBefore = await token.balanceOf(owner);
    await token.transferAndCall(
      minter.address,
      threeTokens,
      payload
    );
    const tokenBalanceAfter = await token.balanceOf(owner);
    expect(tokenBalanceAfter).to.equal(tokenBalanceBefore.sub(threeTokens));
  }); 

  it("should not mint if not enough balance", async function () {
     await expect(token.connect(notOwner).transferAndCall(
      minter.address,
      oneToken,
      payload
    )).to.be.revertedWith('ERC20: transfer amount exceeds balance');
  });

  it("should pay fee to right address", async function () {
    const tokenBalanceBefore = await token.balanceOf(token.address);
    await token.transferAndCall(
      minter.address,
      oneToken,
      payload
    );
    const tokenBalanceAfter = await token.balanceOf(token.address);
    expect(tokenBalanceAfter).to.equal(tokenBalanceBefore.add(oneToken));
  });

  it("should mint an NFT", async function () {
    const tokenBalanceBefore = await minter.balanceOf(owner);
    await token.transferAndCall(
      minter.address,
      oneToken,
      payload
    );
    const tokenBalanceAfter = await minter.balanceOf(owner);
    const onlyOne = ethers.BigNumber.from(1);
    expect(tokenBalanceAfter).to.equal(tokenBalanceBefore.add(onlyOne));
  }); 

  it("should mint an NFT with the right uri", async function () {
    await token.transferAndCall(
      minter.address,
      oneToken,
      payload
    );

    const zero = ethers.BigNumber.from(0);
    const uri = await minter.tokenURI(zero);
    
    expect(ethers.utils.toUtf8String(payload)).to.equal(uri);
  });
});