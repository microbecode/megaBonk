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

  type FarmBalanceSingleData = {
    stakeBalance: BigNumber,
    earnedBalance: BigNumber,
    stakeTokenName: string,
    rewardTokenName: string
  }

  type FarmsDataWithBalances = {
      [farmAddress: string]: FarmBalanceSingleData;
  }

  const [balance, setBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [waitHash, setWaitHash] = useState<string>(null);
  const [successText, setSuccessText] = useState<string>(null);
  //const [farms, setFarms] = useState<ethers.Contract[]>([]);
  const [farmsData, setFarmsData] = useState<FarmsDataWithBalances>({});

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

    let farmsData : FarmsDataWithBalances = {};
    console.log('starting', bonkFarms.length)  
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
    
    console.log('farm balances', farmsData, bonkFarms);
    
    setFarmsData(farmsData);
  }, [selectedAddress, bonkFarms, setFarmsData]);

  useEffect(() => {
    prepareFarmData();
  }, [prepareFarmData, setFarmsData, bonkFarms, toggleUpdate]);

   if (farmsData) {
    console.log('temp', farmsData, farmsData.keys, Object.keys(farmsData))
  } 


  const onStake = async (farmIndex : number, amount : BigNumber) => {
    console.log('farms', bonkFarms[farmIndex], farmIndex)
    const farm = bonkFarms[farmIndex].farm;
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

  const onUnstake = async (farmIndex : number, amount : BigNumber) => {
    const farm = bonkFarms[farmIndex].farm;

    const stakeTx = await farm.withdraw(amount);
    setWaitHash(stakeTx.hash);
    console.log('unstake tx stake', stakeTx)
    await stakeTx.wait();
    setWaitHash(null);

    setSuccessText("Congratulations! You have unstaked some tokens " + amount.toString());

    setToggleUpdate(!toggleUpdate);
    console.log('unstake update set')
  }

  const onCollect = async (farmIndex : number) => {
    const farm = bonkFarms[farmIndex].farm;
    const tx = await farm.getReward();
    setWaitHash(tx.hash);
    console.log('collect tx stake', tx)
    await tx.wait();
    setWaitHash(null);

    setSuccessText("You have collected your staking rewards");

    setToggleUpdate(!toggleUpdate);
    console.log('collect update set')
  }

  const getFarmElem = (farmData : IFarmData, index : number) => {
   // console.log('stake balance', farm)
    const stakeBalance = farmsData[farmData.farm.address];

    const pairName = farmData.stakeTokenName + ' / ' + farmData.rewardTokenName;

    return (<Row key={index}>
        <Col>
          <StakeFarmElem 
            balance={balance} 
            stakeBalance={stakeBalance.stakeBalance} 
            earnedBalance={stakeBalance.earnedBalance} 
            onStake={onStake} 
            onUnstake={onUnstake} 
            farmIndex={index}
            onCollect={onCollect}
            pairName={pairName}
          ></StakeFarmElem>
        </Col>
    {/*   <Col>
        <StakeElem balance={balance}></StakeElem>
        </Col> */}
    </Row>)
  }


  return (
    <div className="bonked">
      {waitHash && <WaitingForTransactionMessage txHash={waitHash}></WaitingForTransactionMessage> }
      {successText && <Notification text={successText}></Notification> }
      <div className="create-container pt-5 pb-0 px-5" id="stake">
        <Container fluid>
          {farmsData && Object.keys(farmsData).length > 0 && bonkFarms.map((farmData, i) => getFarmElem(farmData, i) )}        
        </Container>
      </div>
    </div>
  );
}
