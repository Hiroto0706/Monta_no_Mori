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
import { useParams } from "react-router-dom";
import OgpSetting from "../../../components/Common/OgpSetting";
import OtherImage from "../../../components/Image/UserImage/LinkImage";
import "./Home.css";

export interface responsePayload {
  image: UserImage;
  type: UserType;
}

const SearchTypeHome: React.FC = () => {
  const images = useSelector((state: AppState) => state.images.images);
  const [favoriteIDs, setFavoriteIDs] = useState<string[]>([]);
  const { name } = useParams<{ name: string }>();
  const [otherImages, setOtherImages] = useState<UserImage[]>([]);
  const dispatch = useDispatch();

  const fetchUsersImagesByType = (dispatch: Dispatch, type_name: string) => {
    axios
      .get(import.meta.env.VITE_BASE_API + `search/type/${type_name}`)
      .then((response) => {
        const responsePayload = response.data.payload;
        const transformedImages = responsePayload.map(TransformPayloadToImage);
        dispatch(setImages(transformedImages));
      })
      .catch((error) => {
        console.error("List images failed : ", error);
      });
  };

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

    if (name) {
      dispatch(setImages([]));
      fetchUsersImagesByType(dispatch, name);
    }
  }, [dispatch, name]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BASE_API + "others"
        );
        const transformedImages = response.data.payload.map(
          TransformPayloadToImage
        );
        setOtherImages(transformedImages);
      } catch (error) {
        console.error("list other images failed:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <OgpSetting />

      <div className="home">
        {/* <OrderBy /> */}
        <SearchForm />
        <h2>たいぷが『{name}』のけんさくけっか</h2>
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
                view_count={image.view_count}
                favorite_count={image.favorite_count}
                toggleFavorite={() => toggleFavorite(image.id.toString())}
              />
            ))
          ) : (
            <LoaderSpinner />
          )}
        </ul>

        <h2>そのほかのなかまたち</h2>
        {otherImages.length > 0 ? (
          <ul className="home__image-list">
            {otherImages.slice(0, 8).map((oi) => (
              <OtherImage
                key={oi.id}
                id={oi.id}
                title={oi.title}
                src={oi.src}
                type_id={oi.type.id}
                view_count={oi.view_count}
                favorite_count={oi.favorite_count}
                type={oi.type}
              />
            ))}
          </ul>
        ) : (
          <LoaderSpinner timeout={10000} />
        )}
      </div>
    </>
  );
};

export default SearchTypeHome;
