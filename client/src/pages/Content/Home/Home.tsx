import React from "react";
import Image from "./../../../components/Image/Image";

import "./Home.css";

export default function Home() {
  return (
    <>
      <div className="home">
        <ul className="home__image-list">
          <Image />
          <Image />
          <Image />
          <Image />
          <Image />
          <Image />
          <Image />
          <Image />
          <Image />
        </ul>
      </div>
    </>
  );
}
