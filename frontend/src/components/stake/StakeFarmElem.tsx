import { Col, Container, Row } from "react-bootstrap";
import { BigNumber } from "ethers";
import { StakeElem } from "./StakeElem";


interface Props {
  balance: BigNumber,
  stakeBalance: BigNumber,
  earnedBalance: BigNumber,
  onStake: (tokens : BigNumber) => void,
  onUnstake: (tokens : BigNumber) => void,
  onCollect: () => void,
  farmName : string,
  farmLogo : string,
  stakeTokenDisplayName: string,
  disabled: boolean
}

export function StakeFarmElem(props : Props) {
  const { 
    balance, 
    stakeBalance, 
    earnedBalance, 
    onStake, 
    onUnstake, 
    onCollect, 
    farmName,
    farmLogo,
    stakeTokenDisplayName,
    disabled
  } = props;

  const onFarmStake = (amount : BigNumber) => {
    onStake(amount);
  }

  const onFarmUnstake = (amount : BigNumber) => {
    onUnstake(amount);
  }

  const onFarmCollect = () => {
    onCollect();
  }

  return (
    <Container fluid>
      <Row>
        <Col>
        <img src={farmLogo} height="50"></img>    
        <h3>Farm: {farmName}</h3>
        </Col>        
      </Row>
      <Row>
        <Col>
          <StakeElem 
            balance={balance} 
            earnedBalance={earnedBalance}
            onFarmStake={onFarmStake} 
            isStaking={true}
            onCollect={onFarmCollect}
            disabled={disabled}
            stakeTokenDisplayName={stakeTokenDisplayName}
          ></StakeElem>
        </Col>
         <Col>
            <StakeElem 
              balance={stakeBalance} 
              earnedBalance={earnedBalance} 
              onFarmStake={onFarmUnstake} 
              isStaking={false}
              onCollect={() => {}}
              disabled={disabled}
              stakeTokenDisplayName={stakeTokenDisplayName}
            ></StakeElem>
        </Col>
      </Row>
    </Container>
  );
}
