import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import "../../styles/staking.scss";

export function Staking() {
  return (
    <div className="bonked">
      <div className="staking-container theme-container p-5" id="stake">
        <Container fluid>
          <Row>
            <Col>
              <h1 className="text-uppercase">Staking</h1>
            </Col>
          </Row>
          <Row>
            <Col className="col-12 col-md-6 mb-5">
              <Container>
                <Row>
                  <h5 className="mt-2">Stake BONK</h5>
                </Row>
                <Row>
                  <p>
                    BONK balance: <span className="bonk-txt number">0</span>
                  </p>
                </Row>
                <Row>
                  <Form className="w-100">
                    <Form.Group controlId="formStake">
                      <Form.Control
                        type="number"
                        placeholder="Insert BONK to stake"
                        min="0"
                      />
                      <u className="max-text">max</u>
                    </Form.Group>
                    <Button
                      variant="primary-outline"
                      type="submit"
                      className="w-100 bonk-btn arrow"
                    >
                      Stake
                    </Button>
                  </Form>
                </Row>
                <Row className="mt-4">
                  <div className="mt-3 mr-2">
                    <div className="staking-decor" />
                  </div>
                  <div>
                    <p>
                      Your BONK dividends:{" "}
                      <span className="bonk-txt number">0</span>
                    </p>
                    <Button
                      variant="primary-outline"
                      type="submit"
                      className="bonk-btn arrow mt-2"
                    >
                      Collect
                    </Button>
                  </div>
                </Row>
              </Container>
            </Col>
            <Col className="col-12 col-md-6">
              <Container>
                <Row>
                  <h5 className="mt-2">Unstake BONK</h5>
                </Row>
                <Row>
                  <p>
                    Staked BONK: <span className="bonk-txt number">0</span>
                  </p>
                </Row>
                <Row>
                  <Form className="w-100">
                    <Form.Group controlId="formStake">
                      <Form.Control
                        type="number"
                        placeholder="Insert BONK to unstake"
                        min="0"
                      />
                      <u className="max-text">max</u>
                    </Form.Group>
                    <Button
                      variant="primary-outline"
                      type="submit"
                      className="w-100 bonk-btn arrow"
                    >
                      Unstake
                    </Button>
                  </Form>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
