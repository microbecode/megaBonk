import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import sampleNFT from "../../images/nft_sample.png";
import transparentImg from "../../images/transparent.png";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import "../../styles/createNFT.scss";
import axios from "axios";
import { ContractsContext, Web3Context } from "../../contexts/Context";
import { ethers } from "ethers";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Notification } from "../Notification";

export function CreateNFT() {
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

/*     const balanceAfter = await contractBonkNFTMinter.balanceOf('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');

    const latestUrl = await contractBonkNFTMinter.tokenURI(parseInt(balanceAfter.toString()) - 1);

    console.log('latest url ', 'https://ipfs.io/ipfs/' + latestUrl);
    
    console.log('balance after', balanceAfter.toString()); */


    setToggleUpdate(!toggleUpdate);
  }

  return (
    <div className="bonked">
      {waitHash && <WaitingForTransactionMessage txHash={waitHash}></WaitingForTransactionMessage> }
      {successText && <Notification text={successText}></Notification> }
      <div className="create-container pt-5 pb-0 px-5" id="createnft">
        <Container fluid>
          <Row>
            <Col>
              <h1 className="text-center">CREATE NFT</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="text-center">
                Create your own erc-721 NFTs. Will require 1 megaBONK + gas.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="col-12 col-md-6">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="nftName">
                  <Form.Control type="text" placeholder="NFT name" required />
                </Form.Group>
                <Form.Group controlId="nftDesc">
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    required 
                  />
                </Form.Group>
                <Form.Group controlId="nftImg">
                  <Form.Control
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    placeholder="Upload image"
                    ref={hiddenFileInput}
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <div className="position-relative">
                  <p className="upload-label">Upload image</p>
                  <Image
                    src={imgFile || transparentImg}
                    alt="Uploaded image"
                    className="upload-img"
                    onClick={handleFileUpload}
                  />
                </div>
                <p>
                  BONK fee: <span>1</span> megaBONK
                </p>
                <Row>
                  <Col className="d-flex justify-content-between">
                    <Button
                      variant="primary-outline"
                      type="submit"
                      className="bonk-btn arrow"
                    >
                      Create
                    </Button>
                    <a
                      href="https://opensea.io/"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <Button variant="link" className="text-decoration-none">
                        BONK on{" "}
                        <span className="bonk-txt">
                          <u>opensea.io</u>
                        </span>
                      </Button>
                    </a>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col className="col-12 col-md-6 d-flex">
              <Image className="sampleNFT-img mr-0 ml-auto" src={sampleNFT} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
