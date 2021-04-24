// Arguments for NFTMinter contract, for verifying in Etherscan. Modify by hand and then run something like this:
// npx hardhat --network ropsten verify --constructor-args scripts/minterargs.js 0xE4e374f2bF5d0fC4E95cAf521fd4F6e7BA6c6153
// Yes, this is utterly stupid, but the plugin doesn't support using non-mainnet network automatically
module.exports = [
    "Bonk NFT Minter", 
    "BONK NFT",
    "0x17558d706b99229a3C3BaD9c52d49f2DD4CDB114",
    "0x17558d706b99229a3C3BaD9c52d49f2DD4CDB114",
    "1000000000000000000"
  ];