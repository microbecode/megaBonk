import React from "react";
import { Image } from "react-bootstrap";

type Props = {
  text: string;
  img: string;
  imgClass?: string;
};

export function Feature({ text, img, imgClass }: Props) {
  return (
    <div className="feature-container my-2 d-flex">
      <div
        className={
          "feature-img d-flex align-items-center mx-4 mb-4 " +
          (imgClass ? imgClass : "")
        }
      >
        <Image src={img} className="m-auto" />
      </div>
      <p className="p-3 m-auto">{text}</p>
    </div>
  );
}
