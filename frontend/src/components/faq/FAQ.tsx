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
            question="What is megaBONK?"
            answer="megaBONK is a utility token that can be used to create your own NFT art collectibles. Creating your own NFT only requires 1 BONK per NFT. megaBONK’s aim is simple, we want users to have the best experience possible when they utilize the megaBONK platform."
            eventKey="0"
          />
          <FAQItem
            question="Why upgrade Bonk Token to megaBONK?"
            answer="By shedding the 1% transfer tax, the MegaBONK token will become more liquid, allowing for more lively exchange. Even better, by conforming closer to ERC20 standards, MegaBONK will be easier to integrate into the wider DeFi and NFT ecosystem. A key element in modern smart contracts is *composability*, which drives network effects and synergy across protocols."
            eventKey="1"
          />
          <FAQItem
            question="How did the original BONK Token start?"
            answer="The liquidity was locked on Uniswap & there was no presale/ICO of the tokens. The project was launched with 89% of the tokens sent to a decentralized exchange where anyone can purchase if they wish to use BONK's utility. The other 11% was used for development & art related work. This locking was a response to all the other projects that were rugging during the time. You should always research before investing in anything."
            eventKey="2"
          />
          <FAQItem
            question="Why is megaBONK using NFTs?"
            answer="All in all, we want to experiment with the value and ownership of an image. A NFT is only as valuable as it's context, and that's why megaBONK uses IPFS so the user & the community have more control of their metadata."
            eventKey="3"
          />
        </Accordion>
      </div>
    </div>
  );
}
