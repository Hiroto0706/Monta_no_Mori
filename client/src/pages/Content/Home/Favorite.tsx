import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserImage, responsePayload } from "./Home";

import ImageCard from "../../../components/Image/UserImage/Image";

import "./Home.css";

const Favorite: React.FC = () => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [favoriteIDs, setFavoriteIDs] = useState<string[]>([]);

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

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavoriteIDs(storedFavorites);
    fetchFavoriteImages(setImages, storedFavorites);
  }, []);

  return (
    <>
      <div className="home">
        <h1>Favorite Images</h1>
        {/* <OrderBy /> */}
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
            <p>
              あなたのおきにいりがぞうはまだないよ！すきながぞうはぜひはーとをくりっくしてね！
            </p>
          )}
        </ul>
      </div>
    </>
  );
};

export default Favorite;

const fetchFavoriteImages = (
  setImages: React.Dispatch<React.SetStateAction<UserImage[]>>,
  favoriteIDs: string[]
) => {
  axios
    .get("http://localhost:8080/")
    .then((response) => {
      const responsePayload = response.data.payload;
      const transformedImages = responsePayload.map(transformPayloadToImage);

      const favoriteImages = transformedImages.filter((image: UserImage) =>
        favoriteIDs.includes(image.id.toString())
      );

      setImages(favoriteImages);
    })
    .catch((error) => {
      console.log("List favorite images failed : ", error);
    });
};

const transformPayloadToImage = (payload: responsePayload) => {
  return {
    id: payload.image.id,
    src: payload.image.src,
    title: payload.image.title,
    type_id: payload.image.type_id,
    type: payload.type,
  };
};
