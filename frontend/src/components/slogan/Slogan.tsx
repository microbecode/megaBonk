import React from "react";
import Hero from "../../images/hero.png";
import { Button, Col, Container, Image, Row } from "react-bootstrap";

import "../../styles/slogan.scss";
import { NavHashLink } from "react-router-hash-link";

export function Slogan() {
  return (
    <div className="bonked-left">
      <div className="slogan-container pl-5">
        <Container className="px-0" fluid>
          <Row className="mr-0">
            <Col className="col-12 col-lg-6 align-self-center">
              <Container>
                <Row>
                  <h1 className="hero-title text-uppercase m-0 mb-4">
                    Time to get <span className="important-text">BONKED</span>
                  </h1>
                </Row>
                <Row>
                  <p>
                    BONK is proof of art &#38; NFTs combined with a
                    decentralized volume dependent staking protocol.
                  </p>
                </Row>
                <Row>
                  <p>
                    BONK is a community cryptocurrency project focused on
                    creating & minting NFTs.
                  </p>
                </Row>
                <Row className="justify-content-between">
                  <a
                    href="https://app.uniswap.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline-primary"
                      className="bonk-btn arrow"
                    >
                      Trade
                    </Button>{" "}
                  </a>
                  <NavHashLink to="/#stake" smooth>
                    <Button
                      variant="outline-primary"
                      className="bonk-btn purple arrow"
                    >
                      Stake
                    </Button>{" "}
                  </NavHashLink>
                  <a
                    href="https://app.uniswap.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="my-auto text-decoration-underline"
                  >
                    <u>Add liquidity</u>
                  </a>
                  <a
                    href="https://pools.fyi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="my-auto text-decoration-underline"
                  >
                    <u>Pools.fyi</u>
                  </a>
                </Row>
              </Container>
            </Col>
            <Col className="hero-col col-12 col-lg-6 px-0 d-flex align-self-end">
              <Image className="hero-img" src={Hero} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
