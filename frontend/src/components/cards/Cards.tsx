import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Card1 from "../../images/card1.png";
import Card2 from "../../images/card2.png";
import Card3 from "../../images/card3.png";

import { CardNFT } from "./CardNFT";

import "../../styles/cards.scss";

export function Cards() {
  return (
    <div className="bonked">
      <div className="cards-container theme-container p-5">
        <Container fluid>
          <Row>
            <Col>
              <h2 className="text-uppercase">Bonk NFT CARDS</h2>
            </Col>
          </Row>
          <Row className="justify-content-between m-0">
            <CardNFT
              title="BONK X Silver Bonk"
              desc="Original BONK NFT artwork. Design by cryptomemez"
              img={Card1}
            />

            <CardNFT
              title="BONK X YFL NFT"
              desc="BONK NFTs in collaboration with YFL. NFTs with a balance of YFL tokens. Design by Sir Johnny of Gonzo"
              img={Card2}
            />

            <CardNFT title="MEGABONK Limited Edition" desc="The MEGABONK Limited Edition NFT" img={Card3} />
          </Row>
        </Container>
      </div>
    </div>
  );
}
