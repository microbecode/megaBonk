import { Contract } from "ethers";

export interface IFarmData {
    farm: Contract,
    stakeTokenName: string,
    rewardTokenName: string
}