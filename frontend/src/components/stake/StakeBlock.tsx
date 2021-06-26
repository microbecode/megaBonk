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
import "../../styles/staking.scss";
import MegaBonkImg from "../../images/megabonk.png";
import LpImg from "../../images/lplogo.png";

export function StakeBlock() {

  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [waitHash, setWaitHash] = useState<string>(null);
  const [successText, setSuccessText] = useState<string>(null);

  const {
    contractBonkToken,
    bonkFarms
  } = useContext(ContractsContext);
  const { selectedAddress, decimals } = useContext(Web3Context);

  //console.log('bonk farms', bonkFarms)

  const prepareFarmData = useCallback(async () => {
    if (!selectedAddress || !bonkFarms) {
        return;
    }

    const setFarmBalances = async (farm : IFarmData) =>  {
      
      let tokenBalance = ethers.BigNumber.from("0");
      let stakeBalance = ethers.BigNumber.from("0");
      let earnedBalance = ethers.BigNumber.from("0");

      if (farm.farm) {
        tokenBalance = await farm.stakeToken.balanceOf(selectedAddress);
        stakeBalance = await farm.farm.balanceOf(selectedAddress);
        earnedBalance = await farm.farm.earned(selectedAddress);
      }

      farm.tokenBalance = tokenBalance;
      farm.earnedBalance = earnedBalance;
      farm.stakeBalance = stakeBalance;
    }

    await setFarmBalances(bonkFarms.farm1);
    await setFarmBalances(bonkFarms.farm2);

    console.log('ending', bonkFarms)  

  }, [selectedAddress, bonkFarms]);

  useEffect(() => {
    prepareFarmData();
  }, [prepareFarmData, bonkFarms, toggleUpdate]);

  const onStake = async (farmdata : IFarmData, amount : BigNumber) => {
    
    const farm = farmdata.farm;
    console.log('sending approve', farm.address, amount.toString());

    const txApprove = await farmdata.stakeToken.approve(farm.address, amount);

    setWaitHash(txApprove.hash);
    console.log('tx approve', txApprove)
    await txApprove.wait();
    setWaitHash(null);

    const stakeTx = await farm.stake(amount);
    setWaitHash(stakeTx.hash);
    console.log('tx stake', stakeTx)
    await stakeTx.wait();
    setWaitHash(null);

    setSuccessText("You have successfully staked " + amount.toString() + " tokens");

    setToggleUpdate(!toggleUpdate);
    console.log('update set')
  }

  const onUnstake = async (farmdata : IFarmData, amount : BigNumber) => {
    console.log('starting farm up unstake')
    const stakeTx = await farmdata.farm.withdraw(amount);
    setWaitHash(stakeTx.hash);
    console.log('unstake tx stake', stakeTx)
    await stakeTx.wait();
    setWaitHash(null);

    setSuccessText("You have successfully unstaked " + amount.toString() + " tokens");

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

  const getFarmElem = (data : IFarmData, logo : string) => {
   // console.log('stake balance', farm)

    return (
    <Row>
        <Col>
          <StakeFarmElem 
            balance={data.tokenBalance ?? ethers.BigNumber.from('0')} 
            stakeBalance={data.stakeBalance ?? ethers.BigNumber.from('0')} 
            earnedBalance={data.earnedBalance ?? ethers.BigNumber.from('0')} 
            onStake={(amount) => onStake(data, amount)} 
            onUnstake={(amount) => onUnstake(data, amount)} 
            onCollect={() => onCollect(data)}
            farmName={data.farmName}
            farmLogo={logo}
            disabled={!data.farm}
            stakeTokenDisplayName={data.stakeTokenDisplayName}
          ></StakeFarmElem>
        </Col>
    </Row>)
  }


  return (
    <div className="bonked">
      {waitHash && <WaitingForTransactionMessage txHash={waitHash}></WaitingForTransactionMessage> }
      {successText && <Notification text={successText}></Notification> }
      <div className="create-container pt-5 pb-0 px-5" id="stake">
        <Container fluid className="staking-container">
          {bonkFarms && bonkFarms.farm1 && getFarmElem(bonkFarms.farm1, MegaBonkImg)}
          <br/><br/>
          {bonkFarms && bonkFarms.farm2 && getFarmElem(bonkFarms.farm2, LpImg)}
        </Container>
      </div>
    </div>
  );
}
