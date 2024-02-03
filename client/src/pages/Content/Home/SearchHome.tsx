import React, { useState, useEffect } from "react";
import { Dispatch } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { setImages } from "../../../slice";
import { AppState } from "../../../store";
import { SearchImages } from "../../../components/Form/Search/Search";
import { TransformPayloadToImage } from "./Home";

import ImageCard from "../../../components/Image/UserImage/Image";
import SearchForm from "./SearchForm";
// import OrderBy from "../../../components/Form/OrderBy/OrderBy";
import LoaderSpinner from "../../../components/Common/Loader";

import "./Home.css";

interface UserType {
  id: number;
  name: string;
  src: string;
}

interface UserImage {
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

const SearchHome: React.FC = () => {
  const images = useSelector((state: AppState) => state.images.images);
  const searchQuery = useSelector((state: AppState) => state.images.query);

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

    if (searchQuery != null) {
      SearchImages(searchQuery, dispatch);
    }
  }, [searchQuery, dispatch]);

  return (
    <>
      <div className="home">
        {/* <OrderBy /> */}
        <SearchForm />
        <h2>『{searchQuery}』のけんさくけっか</h2>
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
            <LoaderSpinner timeout={10000} />
          )}
        </ul>
      </div>
    </>
  );
};

export default SearchHome;

export const SearchUserImages = (
  dispatch: Dispatch,
  data: responsePayload[]
) => {
  const transformedImages = data.map(TransformPayloadToImage);
  dispatch(setImages(transformedImages));
};
