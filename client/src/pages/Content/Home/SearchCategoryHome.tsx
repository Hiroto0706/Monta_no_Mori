import React, { useState, useEffect } from "react";
import { Dispatch } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { setImages } from "../../../slice";
import { AppState } from "../../../store";
import axios from "axios";

import { UserImage, UserType, TransformPayloadToImage } from "./Home";

import ImageCard from "../../../components/Image/UserImage/Image";
import SearchForm from "../../../components/Form/Search/SearchForm";
// import OrderBy from "../../../components/Form/OrderBy/OrderBy";
import LoaderSpinner from "../../../components/Common/Loader";

import "./Home.css";
import { useParams } from "react-router-dom";

export interface responsePayload {
  image: UserImage;
  type: UserType;
}

const SearchCategoryHome: React.FC = () => {
  const images = useSelector((state: AppState) => state.images.images);

  const [favoriteIDs, setFavoriteIDs] = useState<string[]>([]);
  const { name } = useParams<{ name: string }>();

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

  const fetchUsersImagesByCategory = (
    dispatch: Dispatch,
    category_name: string
  ) => {
    axios
      .get(import.meta.env.VITE_BASE_API + `search/category/${category_name}`)
      .then((response) => {
        const responsePayload = response.data.payload;
        const transformedImages = responsePayload.map(TransformPayloadToImage);
        dispatch(setImages(transformedImages));
      })
      .catch((error) => {
        console.error("List images failed : ", error);
      });
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavoriteIDs(storedFavorites);

    if (name) {
      dispatch(setImages([]));
      fetchUsersImagesByCategory(dispatch, name);
    }
  }, [dispatch, name]);

  return (
    <>
      <div className="home">
        {/* <OrderBy /> */}
        <SearchForm />
        <h2>かてごりが『{name}』のけんさくけっか</h2>
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
                toggleFavorite={() => toggleFavorite(image.id.toString())}
              />
            ))
          ) : (
            <LoaderSpinner />
          )}
        </ul>
      </div>
    </>
  );
};

export default SearchCategoryHome;
