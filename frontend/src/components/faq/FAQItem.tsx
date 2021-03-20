import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import React, { useState } from "react";

type Props = {
  question: string;
  answer: string;
  eventKey: string;
};

export function FAQItem({ question, answer, eventKey }: Props) {
  const [isActive, setIsActive] = useState(false);

  const onToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <Card>
      <Accordion.Toggle
        as={Card.Header}
        eventKey={eventKey}
        onClick={onToggle}
        className={isActive ? "active" : ""}
      >
        {question}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>{answer}</Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
