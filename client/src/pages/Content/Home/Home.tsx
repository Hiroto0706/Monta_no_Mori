import React, { useState, useEffect } from "react";
import { Dispatch } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { setImages } from "../../../slice";
import { AppState } from "../../../store";
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

export interface responsePayload {
  image: UserImage;
  type: UserType;
}

const Home: React.FC = () => {
  const images = useSelector((state: AppState) => state.images.images);

  const [favoriteIDs, setFavoriteIDs] = useState<string[]>([]);

  const dispatch = useDispatch();

  const toggleFavorite = (imageId: string) => {
    let updatedFavorites;
    if (favoriteIDs.includes(imageId)) {
      updatedFavorites = favoriteIDs.filter((id) => id !== imageId);
    } else {
      updatedFavorites = [...favoriteIDs, imageId];
    }
    setFavoriteIDs(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavoriteIDs(storedFavorites);
    fetchUsersImages(dispatch, null);
  }, [dispatch]);

  return (
    <>
      <div className="home">
        {/* <OrderBy /> */}
        <ul className="home__image-list">
          {images.map((i: UserImage) => (
            <ImageCard
              key={i.id}
              id={i.id}
              title={i.title}
              src={i.src}
              type_id={i.type_id}
              type={i.type}
              toggleFavorite={() => toggleFavorite(i.id.toString())}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;

export const fetchUsersImages = (dispatch: Dispatch, data: any) => {
  if (data) {
    const transformedImages = data.map(transformPayloadToImage);
    dispatch(setImages(transformedImages));
  } else {
    axios
      .get("http://localhost:8080/")
      .then((response) => {
        const responsePayload = response.data.payload;
        const transformedImages = responsePayload.map(transformPayloadToImage);
        dispatch(setImages(transformedImages));
      })
      .catch((error) => {
        console.log("List images failed : ", error);
      });
  }
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
