import React, { useState, useEffect } from "react";
import { Dispatch } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { setImages } from "../../../slice";
import { AppState } from "../../../store";
import axios from "axios";

import ImageCard from "../../../components/Image/UserImage/Image";
import SearchForm from "./SearchForm";
// import OrderBy from "../../../components/Form/OrderBy/OrderBy";
import LoaderSpinner from "../../../components/Common/Loader";

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

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavoriteIDs(storedFavorites);

    FetchUsersImages(dispatch);
  }, [dispatch]);

  return (
    <>
      <div className="home">
        {/* <OrderBy /> */}
        <SearchForm />
        <h2>がぞういちらん</h2>
        <ul className="home__image-list">
          {images.length > 0 ? (
            images.map((image) => (
              <ImageCard
                key={image.id}
                id={image.id}
                title={image.title}
                src={image.src}
                type_id={image.type_id}
                type={image.type}
                toggleFavorite={() =>
                  toggleFavorite(
                    image.id.toString(),
                    favoriteIDs,
                    setFavoriteIDs
                  )
                }
              />
            ))
          ) : (
            <LoaderSpinner timeout={10000} />
          )}
        </ul>
      </div>
    </>
  );
};

export default Home;

export const FetchUsersImages = (dispatch: Dispatch) => {
  axios
    .get(import.meta.env.VITE_BASE_API)
    .then((response) => {
      const responsePayload = response.data.payload;
      const transformedImages = responsePayload.map(TransformPayloadToImage);
      dispatch(setImages(transformedImages));
    })
    .catch((error) => {
      console.error("List images failed : ", error);
    });
};

export const TransformPayloadToImage = (payload: responsePayload) => {
  return {
    id: payload.image.id,
    src: payload.image.src,
    title: payload.image.title,
    type_id: payload.image.type_id,
    type: payload.type,
  };
};

// 引数のIDをもとにローカルホストとReact上のIDsを更新する
const toggleFavorite = (
  imageId: string,
  favoriteIDs: string[],
  setFavoriteIDs: React.Dispatch<React.SetStateAction<string[]>>
) => {
  let updatedFavorites;
  if (favoriteIDs.includes(imageId)) {
    updatedFavorites = favoriteIDs.filter((id) => id !== imageId);
  } else {
    updatedFavorites = [...favoriteIDs, imageId];
  }
  setFavoriteIDs(updatedFavorites);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};
