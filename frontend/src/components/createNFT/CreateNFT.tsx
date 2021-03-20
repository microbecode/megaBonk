import React, { useRef, useState } from "react";
import sampleNFT from "../../images/nft_sample.png";
import transparentImg from "../../images/transparent.png";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";

import "../../styles/createNFT.scss";

export function CreateNFT() {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState(null);

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
    const reader = new FileReader();
    reader.onload = imageIsLoaded;
    reader.readAsDataURL(fileUploaded);
  };

  const imageIsLoaded = (e: any) => {
    setImg(e?.target?.result);
  };

  return (
    <div className="bonked">
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
                Create your own erc-721 NFTs. Will require 1 BONK + gas. Please
                note that this DApp is still under it’s alpha/beta stage. Could
                contain bugs, use at your own risk.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="col-12 col-md-6">
              <Form>
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
                    src={img || transparentImg}
                    alt="Uploaded image"
                    className="upload-img"
                    onClick={handleFileUpload}
                  />
                </div>
                <p>
                  BONK fee: <span>0</span>
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
