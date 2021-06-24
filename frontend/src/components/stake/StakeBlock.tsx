import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import sampleNFT from "../../images/nft_sample.png";
import transparentImg from "../../images/transparent.png";
import { Button, Card, Col, Container, Form, Image, Row } from "react-bootstrap";
import "../../styles/createNFT.scss";
import axios from "axios";
import { ContractsContext, Web3Context } from "../../contexts/Context";
import { BigNumber, Contract, ethers } from "ethers";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Notification } from "../Notification";
import { StakeElem } from "./StakeElem";
import { StakeFarmElem } from "./StakeFarmElem";
import BonkTokenArtifact from "../../contracts/BonkToken.json";
import { IFarmData } from "../types";

export function StakeBlock() {

/*   type FarmBalanceSingleData = {
    stakeBalance: BigNumber,
    earnedBalance: BigNumber,
    farmName: string
  }

  type FarmsDataWithBalances = {
    farm1: FarmBalanceSingleData,
    farm2: FarmBalanceSingleData
      //[farmAddress: string]: FarmBalanceSingleData;
  } */

  const [balance, setBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [waitHash, setWaitHash] = useState<string>(null);
  const [successText, setSuccessText] = useState<string>(null);
  //const [farms, setFarms] = useState<ethers.Contract[]>([]);
/*   const [farmsData, setFarmsData] = useState<FarmsDataWithBalances>(); */

  const {
    contractBonkToken,
    bonkFarms
  } = useContext(ContractsContext);
  const { selectedAddress, decimals } = useContext(Web3Context);

  const loadBalances = useCallback(async () => {
    console.log('starting load balance' , selectedAddress, contractBonkToken, decimals)
    if (
      !selectedAddress ||
      !contractBonkToken ||
      !decimals
    )
      return;

    const bonkBalance = await contractBonkToken.balanceOf(selectedAddress);
    console.log('my address ' + selectedAddress + ' has tokens: ' + bonkBalance.toString(), 'token addr ' + contractBonkToken.address)

    setBalance(bonkBalance);
  }, [selectedAddress, contractBonkToken, decimals]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances, toggleUpdate]);

  //console.log('bonk farms', bonkFarms)

  const prepareFarmData = useCallback(async () => {
    if (!selectedAddress || !bonkFarms) {
        return;
    }

    const setFarmBalances = async (farm : IFarmData) =>  {
      const stakeBalance = await farm.farm.balanceOf(selectedAddress);
      const earnedBalance = await farm.farm.earned(selectedAddress);
      farm.earnedBalance = earnedBalance;
      farm.stakeBalance = stakeBalance;
    }

    await setFarmBalances(bonkFarms.farm1);
    await setFarmBalances(bonkFarms.farm2);

    console.log('ending', bonkFarms)  

    /*
    for (let i = 0; i < bonkFarms.length; i++) {
        const stakeBalance = await bonkFarms[i].farm.balanceOf(selectedAddress);
        const earnedBalance = await bonkFarms[i].farm.earned(selectedAddress);
         const rewardTokenName = await bonkFarms[i].rewardTokenName;
        const stakeTokenName = await bonkFarms[i].stakeTokenName; 


        const data : FarmBalanceSingleData = { 
          stakeBalance, 
          earnedBalance,
          rewardTokenName,
          stakeTokenName
         };
        console.log('found stake bal', data.stakeBalance.toString(), data.earnedBalance.toString() )
        farmsData[bonkFarms[i].farm.address] = data;
    }
    */
/*     console.log('farm balances', farmsData, bonkFarms); */
    
/*     setFarmsData(farmsData); */
  }, [selectedAddress, bonkFarms]);

  useEffect(() => {
    prepareFarmData();
  }, [prepareFarmData, bonkFarms, toggleUpdate]);

 /*   if (farmsData) {
    console.log('temp', farmsData, farmsData.keys, Object.keys(farmsData))
  }  */


  const onStake = async (farmdata : IFarmData, amount : BigNumber) => {
    const farm = farmdata.farm;
    console.log('sending approve', farm.address, amount.toString());

    const txApprove = await contractBonkToken.approve(farm.address, amount);

    setWaitHash(txApprove.hash);
    console.log('tx approve', txApprove)
    await txApprove.wait();
    setWaitHash(null);

    const stakeTx = await farm.stake(amount);
    setWaitHash(stakeTx.hash);
    console.log('tx stake', stakeTx)
    await stakeTx.wait();
    setWaitHash(null);

    setSuccessText("Congratulations! You have staked some tokens " + amount.toString());

    setToggleUpdate(!toggleUpdate);
    console.log('update set')
  }

  const onUnstake = async (farmdata : IFarmData, amount : BigNumber) => {
    const stakeTx = await farmdata.farm.withdraw(amount);
    setWaitHash(stakeTx.hash);
    console.log('unstake tx stake', stakeTx)
    await stakeTx.wait();
    setWaitHash(null);

    setSuccessText("Congratulations! You have unstaked some tokens " + amount.toString());

    setToggleUpdate(!toggleUpdate);
    console.log('unstake update set')
  }

  const onCollect = async (farmdata : IFarmData) => {
    const tx = await farmdata.farm.getReward();
    setWaitHash(tx.hash);
    console.log('collect tx stake', tx)
    await tx.wait();
    setWaitHash(null);

    setSuccessText("You have collected your staking rewards");

    setToggleUpdate(!toggleUpdate);
    console.log('collect update set')
  }

  const getFarmElem = (data : IFarmData) => {
   // console.log('stake balance', farm)

    return (
    <Row>
        <Col>
          <StakeFarmElem 
            balance={balance} 
            stakeBalance={data.stakeBalance} 
            earnedBalance={data.earnedBalance} 
            onStake={(amount) => onStake(data, amount)} 
            onUnstake={(amount) => onUnstake(data, amount)} 
            onCollect={() => onCollect(data)}
            farmName={data.farmName}
          ></StakeFarmElem>
        </Col>
    </Row>)
  }


  return (
    <div className="bonked">
      {waitHash && <WaitingForTransactionMessage txHash={waitHash}></WaitingForTransactionMessage> }
      {successText && <Notification text={successText}></Notification> }
      <div className="create-container pt-5 pb-0 px-5" id="stake">
        <Container fluid>
          {bonkFarms && bonkFarms.farm1 && getFarmElem(bonkFarms.farm1)}
          {bonkFarms && bonkFarms.farm2 && getFarmElem(bonkFarms.farm2)}
{/*           <Row>
            <Col>
              <StakeFarmElem 
                balance={balance} 
                stakeBalance={stakeBalance.stakeBalance} 
                earnedBalance={stakeBalance.earnedBalance} 
                onStake={(amount : BigNumber) => onStake(0, amount)} 
                onUnstake={(amount : BigNumber) => onUnstake(0, amount)} 
                farmIndex={0}
                onCollect={() => onCollect(0)}
                pairName='some name'
              ></StakeFarmElem>
            </Col>
          </Row>) */}
{/*           {farmsData && Object.keys(farmsData).length > 0 && bonkFarms.map((farmData, i) => getFarmElem(farmData, i) )} */}        
        </Container>
      </div>
    </div>
  );
}
