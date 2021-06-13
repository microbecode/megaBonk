import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import sampleNFT from "../../images/nft_sample.png";
import transparentImg from "../../images/transparent.png";
import { Button, Card, Col, Container, Form, Image, Row } from "react-bootstrap";
import "../../styles/createNFT.scss";
import axios from "axios";
import { ContractsContext, Web3Context } from "../../contexts/Context";
import { ethers } from "ethers";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Notification } from "../Notification";
import { StakeElem } from "./StakeElem";

export function Stake() {
  const baseUrl = 'https://bonk-pinata.herokuapp.com';

  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [balance, setBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [waitHash, setWaitHash] = useState<string>(null);
  const [successText, setSuccessText] = useState<string>(null);

  const {
    contractBonkNFTMinter,
    contractBonkToken
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


  const handleFileUpload = (e: any) => {
    if (hiddenFileInput?.current !== null) {
      hiddenFileInput.current.click();
    }
  };

  const handleFileChange = (e: any) => {
    if (!e?.target?.files) {
      setImg(null);
      return;
    }
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) {
      setImg(null);
      return;
    }
    setImg(fileUploaded)
    const reader = new FileReader();
    reader.onload = imageIsLoaded;
    reader.readAsDataURL(fileUploaded);
  };

   const imageIsLoaded = (e: any) => {
    setImgFile(e?.target?.result);
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  }

  return (
    <div className="bonked">
      {waitHash && <WaitingForTransactionMessage txHash={waitHash}></WaitingForTransactionMessage> }
      {successText && <Notification text={successText}></Notification> }
      <div className="create-container pt-5 pb-0 px-5" id="stake">
      <Container fluid>
        <Row>
            <Col>
              <StakeElem balance={balance}></StakeElem>
            </Col>
            <Col>
              <StakeElem balance={balance}></StakeElem>
            </Col>
         </Row>
        </Container>
      </div>
    </div>
  );
}
