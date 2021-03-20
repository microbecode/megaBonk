import dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "@openzeppelin/hardhat-upgrades";

const MNEMONIC = process.env.MNEMONIC;
const INFURA_KEY = process.env.INFURA_KEY;

const needsInfura =
  process.env.npm_config_argv &&
  (process.env.npm_config_argv.includes("rinkeby") ||
    process.env.npm_config_argv.includes("ropsten") ||
    process.env.npm_config_argv.includes("mainnet"));

if ((!MNEMONIC || !INFURA_KEY) && needsInfura) {
  console.error("Please set a mnemonic and infura key.");
  process.exit(0);
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.7.5",
      },
      {
        version: "0.5.16",
      },
    ],
  },
  // defaultNetwork: "hardhat",
  // networks: {
  //   localhost: {
  //     chainId: 1337,
  //   },
  // },
};

export default config;
