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
    const oneToken = ethers.utils.parseUnits("1", 18);
    if (balance.lt(oneToken)) {
      alert("Not enough balance, you only have " + balance.toString());
      return;
    }

    if (!img) {
      alert("Please add a picture");
      return;
    }

    console.log('balance', balance.toString())

    const json = {
      name: e.currentTarget['nftName'].value,
      description: e.currentTarget['nftDesc'].value,
      image: null,
      external_url: 'https://megabonk.com',
      attributes: []
    } ;

    const getBaseUrl = () => {
      // http://localhost:9000
      if (window.location.href.indexOf('localhost') > -1) {
        return 'http://localhost:9000';
      }
    /*   if (window.location.href.indexOf('megabonktest.netlify.app') > -1) {
        return 'https://44cbe8b53b57.ngrok.io';
      } */
      return baseUrl;
    }
    
    const fileUrl = getBaseUrl() + '/api/pinFile';
    const jsonUrl = getBaseUrl() + '/api/pinJSON';

    const formData = new FormData(); 
    formData.append('file', img);

    const imageResponse = await axios.post(fileUrl, formData); 

    json.image = 'https://ipfs.io/ipfs/' + imageResponse.data;
  
    const str = JSON.stringify(json);
    console.log("JSON", str);

    const jsonResponse = await axios.post(
      jsonUrl,
      str,
      {
        headers: {
            'Content-Type': 'application/json'
        }
      });

    console.log('json response hash', jsonResponse.data); 
    const rawPayload = 'https://ipfs.io/ipfs/' + jsonResponse.data;
    console.log('raw payload', rawPayload)

    //const payload = ethers.utils.toUtf8Bytes ('https://ipfs.io/ipfs/QmVTKJh9a2L8uYg4UVhUG3wS39U59d2LdY2R2mNnk49LzY');
    const payload = ethers.utils.toUtf8Bytes(rawPayload);

/*     const balanceBefore = await contractBonkNFTMinter.balanceOf('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');
    console.log('balance before', balanceBefore.toString()); */
    
    
    //console.log('token uri', (await contractBonkNFTMinter.tokenURI(1)).toString());
    console.log('one token', oneToken.toString())
    
    const tx = await contractBonkToken.transferAndCall(
      contractBonkNFTMinter.address,
      oneToken,
      payload,
      { from: selectedAddress },
    );
    setWaitHash(tx.hash);
    console.log('tx', tx)
    await tx.wait();
    setWaitHash(null);
    setSuccessText("Congratulations! You have received an NFT at your address " + selectedAddress);

    setToggleUpdate(!toggleUpdate);
  }

  return (
    <div className="bonked">
      {waitHash && <WaitingForTransactionMessage txHash={waitHash}></WaitingForTransactionMessage> }
      {successText && <Notification text={successText}></Notification> }
      <div className="create-container pt-5 pb-0 px-5" id="stake">
      <Container fluid>
          <Row>
            <Col>
              <h2 className="text-uppercase">Stake</h2>
            </Col>
          </Row>
          <Row className="justify-content-between m-0">
          <Card
            className="card-container theme-card my-2 mx-0"
            style={{ width: "16rem" }}
          >
          <Card.Body>
            <Card.Title>hmm</Card.Title>
            <Card.Text>uuu</Card.Text>
          </Card.Body>
        </Card>

        <Card
            className="card-container theme-card my-2 mx-0"
            style={{ width: "16rem" }}
          >
          <Card.Body>
            <Card.Title>qqq</Card.Title>
            <Card.Text>uugggu</Card.Text>
          </Card.Body>
        </Card>

          </Row>
        </Container>
      </div>
    </div>
  );
}
