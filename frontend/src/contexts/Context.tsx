import { createContext } from "react";
import { BigNumber, Contract } from "ethers";

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
  contractBonkTokenOld?: Contract;
  contractBonkToken?: Contract;
  contractBonkMigrator?: Contract;
};

export const ContractsContext = createContext<Partial<ContractsContextProps>>(
  {},
);
