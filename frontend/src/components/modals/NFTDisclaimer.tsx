import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export function NFTDisclaimer(props: any) {
  return (
    <Modal {...props} size="lg" aria-labelledby="modal-nft" centered>
      <Modal.Header closeButton>
        <Modal.Title id="modal-nft" className="text-uppercase">
          NFT Disclaimer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>BONK Minter Disclaimer

PLEASE READ

BONK Token is an ERC-20 token on the Ethereum blockchain. The BONK Minter allows for the creation of NFTs that are ERC-721 tokens. ERC-721 tokens (NFT's) are non-fungible tokens, be aware that their value is derived only from what people are willing to pay. The value of NFTs are thus highly volatile and BONK holds no liability for such volatility.

All on-chain files are available to everyone, be cautious. Never send a transaction containing personal information.

Ethereum and IPFS will power the BONK NFTs as a means of decentralization and immutability. Although the BONK Minter is a decentralized smart contract, the user of the BONK Minter still exists within the rules of the country in which they reside. BONK advises that users follow all laws and regulations related to their country of residence, and BONK takes no responsibility for any and all actions taken by those using the BONK Minter.

Additionally, BONK is not liable for any breach of copyright by a user of the BONK Minter. All art created with the BONK Minter is to be used on the Ethereum Blockchain, for personal, legal use. Do not explicitly produce copyrighted material without official consent from the holder of the copyright.

To repeat, the Ethereum blockchain and IPFS is transparent and trackable, all responsibility lies with the user of the BONK Minter.

BONK has the right, with sole discretion, to edit this Disclaimer at any time.

By clicking the box below, you agree to all of the terms listed above and to use the BONK Minter in accordance with Local and Federal law.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={props.onHide}
          variant="primary-outline"
          className="d-block bonk-btn"
        >
          I Understand
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
