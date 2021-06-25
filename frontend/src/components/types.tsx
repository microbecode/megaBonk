import { BigNumber, Contract } from "ethers";

export interface IFarms {
    farm1: IFarmData,
    farm2: IFarmData
}

export interface IFarmData {
    farm?: Contract,
    farmName: string,
    stakeToken?: Contract,
    stakeTokenDisplayName?: string,
    tokenBalance?: BigNumber,
    stakeBalance?: BigNumber,
    earnedBalance?: BigNumber
}