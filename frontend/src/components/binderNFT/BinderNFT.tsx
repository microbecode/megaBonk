import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { NavHashLink } from "react-router-hash-link";

import "../../styles/binderNFT.scss";

export function BinderNFT() {
  return (
    <div className="bonked">
      <div className="binder-container theme-container p-5" id="mynfts">
        <Container fluid>
          <Row>
            <Col>
              <h2>MY NFT BINDER</h2>
              <p>
                Sorry, but you do not have any NFTs right now. Go create some.
              </p>
              <NavHashLink to="/#createnft" smooth activeClassName="active">
                <Button
                  variant="primary-outline"
                  type="submit"
                  className="bonk-btn arrow"
                >
                  Create
                </Button>
              </NavHashLink>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
