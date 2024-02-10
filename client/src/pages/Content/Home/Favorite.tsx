import React, { useState, useEffect } from "react";
import axios from "axios";
import { TransformPayloadToImage, UserImage } from "./Home";
import LoaderSpinner from "../../../components/Common/Loader";
import "./Home.css";
import Image from "../../../components/Image/UserImage/Image";

const Favorite: React.FC = () => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [favoriteIDs, setFavoriteIDs] = useState<string[]>([]);
  const [loaderTimeout, setLoaderTimeout] = useState<number>(100000);

  const toggleFavorite = (imageId: string) => {
    let updatedFavorites: string[];
    if (favoriteIDs.includes(imageId)) {
      updatedFavorites = favoriteIDs.filter((id) => id !== imageId);
    } else {
      updatedFavorites = [...favoriteIDs, imageId];
    }
    setFavoriteIDs(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const fetchFavoriteImages = (favoriteIDs: string[]) => {
    const joinedFavIDs = favoriteIDs.join(",");
    axios
      .get(import.meta.env.VITE_BASE_API + "favorite" + `?id=${joinedFavIDs}`)
      .then((response) => {
        const responsePayload = response.data.payload;
        const transformedImages = responsePayload.map(TransformPayloadToImage);
        
        setImages(transformedImages);
      })
      .catch((error) => {
        console.error("List favorite images failed : ", error);
      });
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    if (storedFavorites.length === 0) setLoaderTimeout(0);
    setFavoriteIDs(storedFavorites);
    fetchFavoriteImages(storedFavorites);
  }, [loaderTimeout]);

  return (
    <>
      <div className="home">
        <h2>おきにいりのがぞうたち</h2>
        {/* <OrderBy /> */}
        <ul className="home__image-list">
          {images.length > 0 ? (
            images.map((image) => (
              <Image
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
            <LoaderSpinner
              timeout={loaderTimeout}
              message={"おきにいりのはまだないよ！"}
            />
          )}
        </ul>
      </div>
    </>
  );
};

export default Favorite;
