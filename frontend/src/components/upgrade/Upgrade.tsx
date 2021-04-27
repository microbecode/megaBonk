import { ethers } from "ethers";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ContractsContext, Web3Context } from "../../contexts/Context";

export function Upgrade() {
  const [oldBalance, setOldBalance] = useState("0");
  const [newBalance, setNewBalance] = useState("0");
  const [toggleUpdate, setToggleUpdate] = useState(false);

  const {
    contractBonkNFTMinter,
    contractBonkToken,
    contractBonkTokenOld,
  } = useContext(ContractsContext);
  const { selectedAddress, decimals } = useContext(Web3Context);

  const loadBalances = useCallback(async () => {
    if (
      !selectedAddress ||
      !contractBonkToken ||
      !contractBonkTokenOld ||
      !decimals
    )
      return;

    const oldBonkBalance = await contractBonkTokenOld.balanceOf(
      selectedAddress,
    );
    const oldBonkBalanceFormatted = ethers.utils.formatUnits(
      oldBonkBalance,
      decimals,
    );
    setOldBalance(oldBonkBalanceFormatted);

    const newBonkBalance = await contractBonkToken.balanceOf(selectedAddress);
    const newBonkBalanceFormatted = ethers.utils.formatUnits(
      newBonkBalance,
      decimals,
    );
    setNewBalance(newBonkBalanceFormatted);
  }, [selectedAddress, contractBonkToken, contractBonkTokenOld, decimals]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances, toggleUpdate]);

  const onMigrateClick = async (e: any) => {
    e.preventDefault();
    if (contractBonkTokenOld && contractBonkNFTMinter && selectedAddress) {
      try {
        const oldBonkBalance = await contractBonkTokenOld.balanceOf(
          selectedAddress,
        );

        if (oldBonkBalance.toString() === "0") {
          alert("BONK balance is 0!");
          return;
        }
        const tx = await contractBonkTokenOld.transferAndCall(
          contractBonkNFTMinter.address,
          oldBonkBalance,
          0x0,
          { from: selectedAddress },
        );
        await tx.wait();
        setToggleUpdate(!toggleUpdate);
      } catch (e: any) {
        console.log("Error", e.message, e);
        alert(e.message);
      }
    }
    console.log("migrate");
  };

  return (
    <div className="bonked">
      <div className="p-5 text-center">
        <Container fluid>
          <Row>
            <Col>
              <h1 className="text-uppercase">
              TOKEN MIGRATION ENDED APRIL 8TH. <span className="bonk-txt">Bonk v2</span>
              </h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <a
                href="https://bonktoken.medium.com/migration-to-megabonk-bc1ffc5dd9d0"
                target="_blank"
                rel="noreferrer noopener"
                className="my-auto text-decoration-underline"
              >
                <u>Details</u>
              </a>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                BONK balance:{" "}
                <span className="bonk-txt number">{oldBalance}</span>
              </p>
            </Col>
            <Col>
              <p>
                megaBONK balance:{" "}
                <span className="bonk-txt number">{newBalance}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <a
                href="https://medium.com/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button
                  variant="primary-outline"
                  type="submit"
                  className="bonk-btn arrow"
                  onClick={(e) => onMigrateClick(e)}
                >
                  Migrate
                </Button>
              </a>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
