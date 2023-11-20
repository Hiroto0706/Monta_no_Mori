import React, { useEffect } from "react";
import axios from "axios";

import Image from "../../../components/Image/UserImage/Image";
import OrderBy from "../../../components/Form/OrderBy/OrderBy";

import "./Home.css";

const Home: React.FC = () => {
  useEffect(() => {
    axios
      .get("http://localhost:8080/")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("サーバーからのデータ取得に失敗しました", error);
      });
  }, []);

  return (
    <>
      <div className="home">
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
};

export default Home;
