import React from "react";
import Image from "./../../../components/Image/Image";
import Search from "../../../components/Form/Search/Search";
import OrderBy from "../../../components/Form/OrderBy/OrderBy";

import "./Home.css";

export default function Home() {
  return (
    <>
      <div className="home">
        <Search />
        <OrderBy />
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
