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
                <h2>WHAT IS BONK?</h2>
              </Row>
              <Row className="intro-text">
                <p className="mt-4">
                  Bonk is a decentralized erc20 token that was created on the
                  Ethereum network & is a utility token that can be used to
                  create NFTs. There is a 1% fee on all transfers & a 9%
                  withdraw fee that is sent to the users who are staking so
                  there is no guaranteed return, but those who are staking
                  benefit by the more transactions on the network.
                </p>
              </Row>
              <Row className="intro-text">
                <p className="mt-4">
                  BONK’s vision for NFTs are to utilize them in a multifaceted
                  way & you can create your own NFTs using BONK. This will come
                  from professional artists being able to create commissioned
                  pieces and the community being able to create their own
                  designs & mint them into an NFT.
                </p>
              </Row>
            </Container>
          </Col>
          <Col className="d-flex flex-column justify-content-center align-items-end col-12 col-md-6">
            <Feature
              text="BONK is an ERC20 token and 1% of every transfer is bonked into the staking pool."
              img={FeatImg1}
              imgClass="purple"
            />
            <Feature
              text="Staking BONK is free and when you unstake, 9% is bonked into the staking pool."
              img={FeatImg2}
              imgClass="pink"
            />
            <Feature
              text="Staking BONK earns BONK from the tokens that are bonked into the staking pool."
              img={FeatImg3}
              imgClass="green"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
