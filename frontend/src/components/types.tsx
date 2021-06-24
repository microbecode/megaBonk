import { BigNumber, Contract } from "ethers";

export interface IFarms {
    farm1: IFarmData,
    farm2: IFarmData
}

export interface IFarmData {
    farm: Contract,
    farmName: string,
    stakeBalance?: BigNumber,
    earnedBalance?: BigNumber
}