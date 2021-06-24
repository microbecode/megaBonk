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
  balance: BigNumber,
  earnedBalance: BigNumber,
  onFarmStake: (tokens : BigNumber) => void,
  onCollect: () => void,
  isStaking: boolean,
  disabled: boolean
}

export function StakeElem(props : Props) {
  const { balance, earnedBalance, onFarmStake, isStaking, onCollect, disabled } = props;

  const [tokensSelected, setTokensSelected] = useState<BigNumber>(ethers.BigNumber.from('0'));

  const onInsertMax = (e) => {
    e.preventDefault();
    setTokensSelected(balance);
  }

  const changeTokenAmount = (e) => {
    const absolute = ethers.BigNumber.from(e.target.value);
    //const display = ethers.utils.formatUnits(absolute, 18);
    setTokensSelected(absolute);
  }


// ethers.utils.formatUnits(balance, 18)
  return (
    <Container fluid>
      <Row>
        <Col>
          {isStaking ? 'Stake' : 'Unstake'} mBONK
        </Col>
      </Row>
      <Row>
        <Col>
          Balance: {balance ? balance.toString() : 0 }
        </Col>
      </Row>
      <Form onSubmit={() => {}}>
        <Row>   
        <Col>   
          <Form.Group controlId="stakeAmount">
            
            <Form.Control
              type="text"
              placeholder={"Insert mBONK to " + (isStaking ? "stake" : "unstake")}
              required
              value={tokensSelected.toString()}
              onChange={e => changeTokenAmount(e)}
            />
            </Form.Group>
              </Col>
              <Col>
                <a
                href="#stake"
                rel="noopener noreferrer"
                className="my-auto text-decoration-underline"
                onClick={(e) => { onInsertMax(e) }}
                >
                  <u>Insert maximum</u>
                </a>              
              </Col>
        </Row>  
        <Row>
          <Button
            variant="primary-outline"
            type="submit"
            className="bonk-btn arrow"
            onClick={(e) => { e.preventDefault(); onFarmStake(tokensSelected); }}
            disabled={disabled}
          >
            {isStaking ? 'Stake' : 'Unstake'}
          </Button>
        </Row>

      </Form>
      {isStaking && 
      <>
        <Row>Your mBONK rewards: {earnedBalance.toString()}</Row>
        <Row>
        <Button
            variant="primary-outline"
            type="submit"
            className="bonk-btn arrow"
            onClick={(e) => { e.preventDefault(); onCollect(); }}
            disabled={disabled}
          >
            Collect
          </Button>
        </Row>
      </>}
    </Container>
  );
}
