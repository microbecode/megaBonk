import { Col, Container, Row } from "react-bootstrap";
import Logo from "../../images/seal-logo.svg";
import React, { useState } from "react";

import twitter from "../../images/twitter.png";
import medium from "../../images/medium.png";
import telegram from "../../images/telegram.png";
import discord from "../../images/discord.png";
import github from "../../images/github.png";
import twitch from "../../images/twitch.png";
import etherscan from "../../images/etherscan.png";

import { PrivacyPolicy } from "../modals/PrivacyPolicy";
import { NFTDisclaimer } from "../modals/NFTDisclaimer";

import "../../styles/footer.scss";

export function Footer() {
  const [modalPrivacyPolicyShow, setModalPrivacyPolicyShow] = useState(false);
  const [modalNFTDisclaimerShow, setModalNFTDisclaimerShow] = useState(false);

  return (
    <footer className="footer-container bonked">
      <Container fluid className="px-5">
        <Row className="m-0">
          <Col xs={12} md={6} lg={4}>
            <Row className="footer-logo justify-content-left">
              <a href="#" rel="noreferrer noopener">
                <img alt="" src={Logo} />
              </a>
            </Row>
          </Col>
          <Col xs={12} md={6} lg={4} className="mt-4 mt-md-0">
            <Row className="justify-content-center">
              <p>Got questions? Ask us on our channels</p>
            </Row>
            <Row className="justify-content-center">
              <a
                className="mr-3"
                href="https://twitter.com/bonktoken"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img className="social-img" alt="social" src={twitter} />
              </a>
              <a
                className="mr-3"
                href="https://medium.com/bonktoken"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img className="social-img" alt="social" src={medium} />
              </a>
              <a
                className="mr-3"
                href="https://t.me/bonktoken"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img className="social-img" alt="social" src={telegram} />
              </a>
              <a
                className="mr-3"
                href="https://discord.com/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img className="social-img" alt="social" src={discord} />
              </a>
              <a
                className="mr-3"
                href="https://github.com/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img className="social-img" alt="social" src={github} />
              </a>
              <a
                className="mr-3"
                href="https://www.twitch.tv/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img className="social-img" alt="social" src={twitch} />
              </a>
              <a
                href="https://etherscan.io/token/0xacfe45c352c902ae3a3f9b6bfe6ec994c5d791bf?a=0xc86201d5055375b18d44a4761293839af9cfae84"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img className="social-img" alt="social" src={etherscan} />
              </a>
            </Row>
          </Col>
          <Col xs={12} md={12} lg={4} className="mt-4 mt-lg-0">
            <Row className="justify-content-center justify-content-lg-end">
              <p
                className="modal-link"
                onClick={() => setModalNFTDisclaimerShow(true)}
              >
                NFT Disclaimer
              </p>
            </Row>
            <Row className="justify-content-center justify-content-lg-end">
              <p
                className="modal-link"
                onClick={() => setModalPrivacyPolicyShow(true)}
              >
                Privacy policy
              </p>
            </Row>
          </Col>
        </Row>
      </Container>
      <PrivacyPolicy
        show={modalPrivacyPolicyShow}
        onHide={() => setModalPrivacyPolicyShow(false)}
      />
      <NFTDisclaimer
        show={modalNFTDisclaimerShow}
        onHide={() => setModalNFTDisclaimerShow(false)}
      />
    </footer>
  );
}
