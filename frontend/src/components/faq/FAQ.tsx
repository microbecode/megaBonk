import Accordion from "react-bootstrap/Accordion";
import React from "react";
import { FAQItem } from "./FAQItem";

import "../../styles/faq.scss";

export function FAQ() {
  return (
    <div className="bonked">
      <div className="faq-container pt-5 pb-0 px-5" id="faq">
        <h2 className="text-uppercase text-center">
          Frequently Asked Questions
        </h2>
        <Accordion className="text-left">
          <FAQItem
            question="What is BONK?"
            answer="BONK is a utility token cryptocurrency that can be used to create your own NFT art collectibles. Creating your own NFT only requires 1 BONK per NFT. BONK’s aim is simple, we want users to have the best experience possible when they utilize the BONK platform."
            eventKey="0"
          />
          <FAQItem
            question="Does BONK do anything different from other similar projects?"
            answer="answer 2"
            eventKey="1"
          />
          <FAQItem
            question="How did BONK start?"
            answer="answer 3"
            eventKey="2"
          />
          <FAQItem
            question="Why is BONK using NFTs?"
            answer="answer 4"
            eventKey="3"
          />
        </Accordion>
      </div>
    </div>
  );
}
