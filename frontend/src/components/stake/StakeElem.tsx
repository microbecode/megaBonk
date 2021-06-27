import { useState } from "react";
import { Button, Card, Col, Container, Form, Image, Row } from "react-bootstrap";
import { BigNumber, ethers } from "ethers";
import "../../styles/staking.scss";

interface Props {
  balance: BigNumber,
  earnedBalance: BigNumber,
  onFarmStake: (tokens : BigNumber) => void,
  onCollect: () => void,
  isStaking: boolean,
  disabled: boolean,
  stakeTokenDisplayName: string
}

export function StakeElem(props : Props) {
  const { 
    balance, 
    earnedBalance, 
    onFarmStake, 
    isStaking, 
    onCollect, 
    disabled, 
    stakeTokenDisplayName 
  } = props;

  const [tokensSelected, setTokensSelected] = useState<BigNumber>(ethers.BigNumber.from('0'));

  const onInsertMax = (e) => {
    e.preventDefault();
    setTokensSelected(balance);
  }

  const changeTokenAmount = (numberish) => {
    const absolute = ethers.utils.parseUnits(numberish, 18);
    //const display = ethers.utils.formatUnits(absolute, 18);
    setTokensSelected(absolute);
  }

  const onLocalFarmStake = (amount : BigNumber) => {
    console.log('farming ', amount.toString())
    onFarmStake(amount);
    //changeTokenAmount("0");
  }

  const onLocalCollect = () => {
    onCollect();
    //changeTokenAmount("0");
  }

  const format = (amount) => {
    return ethers.utils.formatUnits(amount, 18);
  }

// 
  return (
    <Container fluid>
      <Row>
        <Col>
          {isStaking ? 'Stake' : 'Unstake'} {stakeTokenDisplayName}
        </Col>
      </Row>
      <Row>&nbsp;</Row>
      <Row>
        <Col>
        {isStaking ? 'Balance' : 'Staked balance'}: {balance ? format(balance): 0 }
        </Col>
      </Row>
      <Row>&nbsp;</Row>
      <Form onSubmit={() => {}} className="form-group">
        <Row>   
        <Col>   
          <Form.Group controlId="stakeAmount" >
            
            <Form.Control
              type="text"
              required
              value={format(tokensSelected)}
              onChange={e => changeTokenAmount(e.target.value)}
            />
            </Form.Group>
              </Col>
              <Col className="helptext">
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
            onClick={(e) => { e.preventDefault(); onLocalFarmStake(tokensSelected); }}
            disabled={disabled}
          >
            {isStaking ? 'Stake' : 'Unstake'}
          </Button>
        </Row>

      </Form>
      {isStaking && 
      <>
        <Row>Your {stakeTokenDisplayName} rewards: {format(earnedBalance)}</Row>
        <Row>&nbsp;</Row>
        <Row>
        <Button
            variant="primary-outline"
            type="submit"
            className="bonk-btn arrow"
            onClick={(e) => { e.preventDefault(); onLocalCollect(); }}
            disabled={disabled}
          >
            Collect
          </Button>
        </Row>
      </>}
    </Container>
  );
}
