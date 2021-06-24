import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import sampleNFT from "../../images/nft_sample.png";
import transparentImg from "../../images/transparent.png";
import { Button, Card, Col, Container, Form, Image, Row } from "react-bootstrap";
import "../../styles/createNFT.scss";
import axios from "axios";
import { ContractsContext, Web3Context } from "../../contexts/Context";
import { BigNumber, ethers } from "ethers";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Notification } from "../Notification";
import { StakeElem } from "./StakeElem";

interface Props {
  balance: BigNumber,
  stakeBalance: BigNumber,
  earnedBalance: BigNumber,
  onStake: (tokens : BigNumber) => void,
  onUnstake: (tokens : BigNumber) => void,
  onCollect: () => void,
  farmName : string,
  disabled: boolean
}

export function StakeFarmElem(props : Props) {
  const { 
    balance, 
    stakeBalance, 
    earnedBalance, 
    onStake, 
    onUnstake, 
    onCollect, 
    farmName,
    disabled
  } = props;

  const onFarmStake = (amount : BigNumber) => {
    onStake(amount);
  }

  const onFarmUnstake = (amount : BigNumber) => {
    onUnstake(amount);
  }

  const onFarmCollect = () => {
    onCollect();
  }

  return (
    <Container fluid>
      <Row>
        <h3>Farm: {farmName}</h3>
      </Row>
      <Row>
        <Col>
          <StakeElem 
            balance={balance} 
            earnedBalance={earnedBalance}
            onFarmStake={onFarmStake} 
            isStaking={true}
            onCollect={onFarmCollect}
            disabled={disabled}
          ></StakeElem>
        </Col>
         <Col>
            <StakeElem 
              balance={stakeBalance} 
              earnedBalance={earnedBalance} 
              onFarmStake={onFarmUnstake} 
              isStaking={false}
              onCollect={() => {}}
              disabled={disabled}
            ></StakeElem>
        </Col>
      </Row>
    </Container>
  );
}
