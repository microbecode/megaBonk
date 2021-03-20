import React from "react";
import { Card } from "react-bootstrap";

import "../../styles/cardNFT.scss";

type Props = {
  title: string;
  desc: string;
  img: string;
};

export function CardNFT({ title, desc, img }: Props) {
  return (
    <Card
      className="card-container theme-card my-2 mx-0"
      style={{ width: "16rem" }}
    >
      <Card.Img variant="top" src={img} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{desc}</Card.Text>
      </Card.Body>
    </Card>
  );
}
