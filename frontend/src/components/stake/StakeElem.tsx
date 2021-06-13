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

interface Props {
  balance: BigNumber
}

export function StakeElem(props : Props) {
  const { balance } = props;


  return (
    <Container fluid>
      <Row>
        <Col>
          Stake mBONK
        </Col>
      </Row>
      <Row>
        <Col>
          Balance: {balance.toString()}
        </Col>
      </Row>
      <Row>
        <Card className="card-container theme-card my-2 mx-0"
              style={{ width: "16rem" }}>
          <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text>
              Insert mBONK to stake
              <a
                    href="#stake"
                    rel="noopener noreferrer"
                    className="my-auto text-decoration-underline"
                    onClick={() => {}}
                  >
                    <u>Insert maximum</u>
                  </a>
              </Card.Text>
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <Button
          variant="primary-outline"
          type="submit"
          className="bonk-btn arrow"
        >
          Stake
        </Button>
      </Row>
      <Row>0</Row>
      <Row>Your mBONK rewards</Row>
      <Row>
      <Button
          variant="primary-outline"
          type="submit"
          className="bonk-btn arrow"
        >
          Collect
        </Button>
      </Row>
    </Container>
  );
}
