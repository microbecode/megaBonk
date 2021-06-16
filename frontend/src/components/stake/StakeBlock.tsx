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


export function StakeBlock() {

    type FarmsStakeBalance = {
        [farmAddress: string]: BigNumber;
    }


  const [balance, setBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [waitHash, setWaitHash] = useState<string>(null);
  const [successText, setSuccessText] = useState<string>(null);
  //const [farms, setFarms] = useState<ethers.Contract[]>([]);
  const [farmsBalances, setFarmsBalances] = useState<FarmsStakeBalance>({});
  const [farmBalancesPopulated, setFarmBalancesPopulated] = useState<boolean>(false);

  const {
    contractBonkToken,
    contractBonkFarms
  } = useContext(ContractsContext);
  const { selectedAddress, decimals } = useContext(Web3Context);

  const loadBalances = useCallback(async () => {
    console.log('hmm' , selectedAddress, contractBonkToken, decimals)
    if (
      !selectedAddress ||
      !contractBonkToken ||
      !decimals
    )
      return;

    const bonkBalance = await contractBonkToken.balanceOf(selectedAddress);
    console.log('my address ' + selectedAddress + ' has tokens: ' + bonkBalance.toString())

    setBalance(bonkBalance);
  }, [selectedAddress, contractBonkToken, decimals]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances, toggleUpdate]);

  const prepareFarmData = useCallback(async () => {
    if (!selectedAddress || !contractBonkFarms) {
        return;
    }

    let farmsBalances : FarmsStakeBalance = {};
    console.log('starting', contractBonkFarms.length)  
    for (let i = 0; i < contractBonkFarms.length; i++) {
        const stakeBalance1 = await contractBonkFarms[i].balanceOf(selectedAddress);
        console.log('found stake bal', stakeBalance1)
        farmsBalances[contractBonkFarms[i].address] = stakeBalance1;
    }
    
    console.log('farm balances', farmsBalances, contractBonkFarms);
    
    setFarmsBalances(farmsBalances);
    setFarmBalancesPopulated(true);
  }, [selectedAddress, contractBonkFarms, setFarmBalancesPopulated, setFarmsBalances]);

  useEffect(() => {
    prepareFarmData();
  }, [prepareFarmData, setFarmsBalances, contractBonkFarms, toggleUpdate]);



  const onStake = async (farmIndex : number, amount : BigNumber) => {
    console.log('farms', contractBonkFarms[0], farmIndex)
    const farm = contractBonkFarms[farmIndex];
    console.log('sending approve', farm.address, amount.toString());

    const txApprove = await contractBonkToken.approve(farm.address, amount);

    setWaitHash(txApprove.hash);
    console.log('tx approve', txApprove)
    await txApprove.wait();
    setWaitHash(null);

    const stakeTx = farm.stake(amount);
    setWaitHash(stakeTx.hash);
    console.log('tx stake', stakeTx)
    await stakeTx.wait();
    setWaitHash(null);

    setSuccessText("Congratulations! You have staked some tokens " + amount.toString());

    setToggleUpdate(!toggleUpdate);
  }

  const getFarmElem = (farm : Contract, index : number) => {
    console.log('stake balance', farm)
    const stakeBalance = farmsBalances[farm.address];

    return (<Row key={index}>
        <Col>
        <StakeFarmElem balance={balance} stakeBalance={stakeBalance} onStake={onStake} farmIndex={index}></StakeFarmElem>
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
          {farmBalancesPopulated && contractBonkFarms.map((farm, i) => getFarmElem(farm, i) )}        
        </Container>
      </div>
    </div>
  );
}
