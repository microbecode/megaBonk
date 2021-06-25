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
          {isStaking ? 'Stake' : 'Unstake'} {stakeTokenDisplayName}
        </Col>
      </Row>
      <Row>
        <Col>
        {isStaking ? 'Balance' : 'Staked balance'}: {balance ? balance.toString() : 0 }
        </Col>
      </Row>
      <Form onSubmit={() => {}} className="form-group">
        <Row>   
        <Col>   
          <Form.Group controlId="stakeAmount" >
            
            <Form.Control
              type="text"
              required
              value={tokensSelected.toString()}
              onChange={e => changeTokenAmount(e)}
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
            onClick={(e) => { e.preventDefault(); onFarmStake(tokensSelected); }}
            disabled={disabled}
          >
            {isStaking ? 'Stake' : 'Unstake'}
          </Button>
        </Row>

      </Form>
      {isStaking && 
      <>
        <Row>Your {stakeTokenDisplayName} rewards: {earnedBalance.toString()}</Row>
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
