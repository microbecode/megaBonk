import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import FeatImg1 from "../../images/feat1.png";
import FeatImg2 from "../../images/feat2.png";
import FeatImg3 from "../../images/feat3.png";

import "../../styles/intro.scss";
import { Feature } from "./Feature";

export function Intro() {
  return (
    <div className="bonked">
      <Container fluid className="intro-container theme-container p-5">
        <Row>
          <Col className="col-12 col-md-6 mb-5">
            <Container>
              <Row>
                <h2>WHAT IS megaBONK?</h2>
              </Row>
              <Row className="intro-text">
                <p className="mt-4">
                megaBonk is a decentralized erc20 token that was created on the Ethereum network & is a utility token that can be used to create NFTs.
                </p>
              </Row>
              <Row className="intro-text">
                <p className="mt-4">
                megaBONK’s vision for NFTs are to utilize them in a multifaceted way so users can create their own NFTs using megaBONK. Our NFTs come from professional artists, the team, and our amazing community.
                </p>
              </Row>
            </Container>
          </Col>
          <Col className="d-flex flex-column justify-content-center align-items-end col-12 col-md-6">
            <Feature
              text="Create your own megaNFTs using megaBONK."
              img={FeatImg1}
              imgClass="purple"
            />
            <Feature
              text="NFT metadata stored using IPFS, so you control your metadata"
              img={FeatImg2}
              imgClass="pink"
            />
            <Feature
              text="Earn liquidity rewards with megaBONK"
              img={FeatImg3}
              imgClass="green"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
