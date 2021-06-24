import { createContext } from "react";
import { BigNumber, Contract } from "ethers";
import { IFarmData, IFarms } from "../components/types";

type Web3ContextProps = {
  balance?: BigNumber;
  selectedAddress?: string;
  symbol?: string;
  decimals?: string;
  transferFunc?: (to: string, amount: string) => Promise<void>;
  setIsProcessing?: (isProcessing: boolean) => void;
};

export const Web3Context = createContext<Partial<Web3ContextProps>>({});

type ContractsContextProps = {
  contractBonkToken?: Contract;
  contractBonkNFTMinter?: Contract;
  bonkFarms?: IFarms;
};

export const ContractsContext = createContext<Partial<ContractsContextProps>>(
  {},
);
