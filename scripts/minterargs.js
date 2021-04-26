// Arguments for NFTMinter contract, for verifying in Etherscan. Modify by hand and then run something like this:
// npx hardhat --network ropsten verify --constructor-args scripts/minterargs.js 0xE4e374f2bF5d0fC4E95cAf521fd4F6e7BA6c6153
// Yes, this is utterly stupid, but the plugin doesn't support using non-mainnet network automatically
module.exports = [
    "Bonk NFT Minter", 
    "BONK NFT",
    "0xacfe45c352c902ae3a3f9b6bfe6ec994c5d791bf", // bonktoken
    "0x4CB22371F39f7333A59D20cCa6a92B29DD7dc298", // fee collector
    "1000000000000000000" // fee
  ];