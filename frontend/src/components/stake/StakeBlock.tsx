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

  const [balance, setBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [waitHash, setWaitHash] = useState<string>(null);
  const [successText, setSuccessText] = useState<string>(null);
  const [farms, setFarms] = useState<ethers.Contract[]>([]);

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
  
  const handleSubmit = async (e) => {
    e.preventDefault();    
  }

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

  return (
    <div className="bonked">
      {waitHash && <WaitingForTransactionMessage txHash={waitHash}></WaitingForTransactionMessage> }
      {successText && <Notification text={successText}></Notification> }
      <div className="create-container pt-5 pb-0 px-5" id="stake">
      <Container fluid>
          {contractBonkFarms && contractBonkFarms.map((farm, i) => {
            return (<Row key={i}>
                <Col>
                <StakeFarmElem balance={balance} onStake={onStake} farmIndex={0}></StakeFarmElem>
                </Col>
            {/*   <Col>
                <StakeElem balance={balance}></StakeElem>
                </Col> */}
            </Row>)
          })}
        
        </Container>
      </div>
    </div>
  );
}
