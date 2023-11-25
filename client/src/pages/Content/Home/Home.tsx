import React, { useState, useEffect } from "react";
import axios from "axios";

import ImageCard from "../../../components/Image/UserImage/Image";
// import OrderBy from "../../../components/Form/OrderBy/OrderBy";

import "./Home.css";

export interface UserType {
  id: number;
  name: string;
  src: string;
}

export interface UserImage {
  id: number;
  title: string;
  src: string;
  type_id: number;
  type: UserType;
}

interface responsePayload {
  image: UserImage;
  type: UserType;
}

const Home: React.FC = () => {
  const [images, setImages] = useState<UserImage[]>([]);

  useEffect(() => {
    fetchUsersImages(setImages);
  }, []);

  return (
    <>
      <div className="home">
        {/* <OrderBy /> */}
        <ul className="home__image-list">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              id={image.id}
              title={image.title}
              src={image.src}
              type_id={image.type_id}
              type={image.type}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;

export const fetchUsersImages = (
  setImages: React.Dispatch<React.SetStateAction<UserImage[]>>
) => {
  axios
    .get("http://localhost:8080/")
    .then((response) => {
      const responsePayload = response.data.payload;
      const transformedImages = responsePayload.map(transformPayloadToImage);
      setImages(transformedImages);
    })
    .catch((error) => {
      console.log("List images failed : ", error);
    });
};

export const transformPayloadToImage = (payload: responsePayload) => {
  return {
    id: payload.image.id,
    src: payload.image.src,
    title: payload.image.title,
    type_id: payload.image.type_id,
    type: payload.type,
  };
};
