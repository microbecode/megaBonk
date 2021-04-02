import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Helper1 from "../../images/helper1.png";
import Helper2 from "../../images/helper2.png";
import Helper3 from "../../images/helper3.png";
import Helper4 from "../../images/helper4.png";
import Helper5 from "../../images/helper5.png";
import Helper6 from "../../images/helper6.png";
import Helper7 from "../../images/helper7.png";
import Helper8 from "../../images/helper8.png";
import Helper9 from "../../images/helper9.png";

import { HelperItem } from "./HelperItem";

import "../../styles/helpers.scss";

export function Helpers() {
  return (
    <div className="bonked">
      <div className="helpers-container theme-container text-center p-5 mt-5">
        <Container fluid>
          <Row>
            <Col>
              <h2 className="text-uppercase">Bonk helpers</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Our Team</p>
            </Col>
          </Row>
          <Row className="justify-content-between mt-5">
            <HelperItem
              title="Seal Ze"
              desc="Artistic Direction & Development"
              img={Helper1}
            />

            <HelperItem
              title="Roy Blackstone"
              desc="Advisor, Investor, & Author"
              img={Helper2}
            />

            <HelperItem
              title="Keegan"
              desc="Community Advisor & Developer"
              img={Helper3}
            />

            <HelperItem
              title="Jay"
              desc="Enigmatic Advisor"
              img={Helper4}
            />

            <HelperItem
              title="Andrei Mironovits"
              desc="Web Design, @ArkRide on Telegram"
              img={Helper5}
            />

            <HelperItem
              title="Sir Johnny of Gonzo"
              desc="Motion Graphics & Design"
              img={Helper6}
            />

            <HelperItem
              title="Nawaal"
              desc="Community Moderator & Support"
              img={Helper7}
            />

            <HelperItem
               title="Augustin Durand"
               desc="Art & Design"
              img={Helper8}
            />

            <HelperItem
              title="Cryptomemez"
              desc="Art & Design"
              img={Helper9}
            />
          </Row>
        </Container>
      </div>
    </div>
  );
}
