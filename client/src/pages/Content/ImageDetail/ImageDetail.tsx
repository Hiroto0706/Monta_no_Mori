import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { UserImage, UserType } from "../Home/Home";
import { ModalCategory } from "../../../components/Image/UserImage/Modal/ModalImage";
import OtherImage from "../../../components/Image/UserImage/LinkImage";
import {
  downloadImage,
  copyImageToClipboard,
} from "../../../components/Image/imageUtil";
import { TransformPayloadToImage } from "../Home/Home";

import "./ImageDetail.css";

const ImageDetail: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [, setFavoriteIDs] = useState<string[]>([]);
  const [image, setImage] = useState<UserImage | null>(null);
  const [otherImages, setOtherImages] = useState<UserImage[]>([]);
  const [type, setType] = useState<UserType | null>(null);
  const [categories, setCategories] = useState<ModalCategory[]>([]);
  const [loadingMessage, setLoadingMessage] =
    useState<string>("がぞうはみつからなかったよ");

  const dispatch = useDispatch();

  const toggleLike = (id: string) => {
    // localStorageからfavoritesを取得し、JSON配列に変換する
    const favorites: string[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    if (favorites.includes(id)) {
      // idが含まれている場合は削除
      setIsLiked(false);
      const updatedFavorites = favorites.filter(
        (favoriteId) => favoriteId !== id
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      // idが含まれていない場合は追加
      setIsLiked(true);
      const updatedFavorites = [...favorites, id];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    const decodedPathname = decodeURIComponent(pathname);
    const imageTitle = decodedPathname.startsWith("/")
      ? decodedPathname.slice(1)
      : decodedPathname;

    axios
      .get(import.meta.env.VITE_BASE_API + `image/${imageTitle}`)
      .then((response) => {
        setImage(response.data.result.image);
        setType(response.data.result.type);
        setCategories(response.data.result.categories);
      })
      .catch((error) => {
        console.error("List categories failed:", error);
      });
  }, []);

  useEffect(() => {
    if (image?.id) {
      const favorites: string[] = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      setIsLiked(favorites.includes(image.id.toString()));
    }
  }, [image]);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavoriteIDs(storedFavorites);

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
        setLoadingMessage("がぞうはみつからなかったよ");
        console.error("list other images failed:", error);
      }
    };

    setLoadingMessage("Loading中だよ...!");
    fetchData();
  }, [dispatch]);

  return (
    <>
      {image && type && categories ? (
        <div>
          <div className="image-detail">
            <div className="image-detail__img">
              <div className="img">
                <img src={image.src} alt={image.title} />
              </div>
            </div>

            <div className="image-detail__desc">
              <div>
                <div className="title">
                  <h2>{image.title}</h2>
                  <img
                    src={isLiked ? "/heart-icon_1.png" : "/heart-icon_0.png"}
                    onClick={() => {
                      console.log("clicked");
                      toggleLike(image.id.toString());
                    }}
                  />
                </div>

                <div className="type">
                  <h3>たいぷ</h3>
                  <Link
                    to={`/search/type/${type.name}`}
                    className="type-link-modal"
                  >
                    <img src={type.src} />
                    {type.name}
                  </Link>
                </div>

                <div className="category">
                  <h3>かてごり</h3>
                  {categories.map((category) => (
                    <Link
                      to={`/search/category/${category.name}`}
                      className="category-link"
                      key={category.id}
                    >
                      #{category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="image-detail__desc__button user-modal">
                <button
                  className="download"
                  onClick={() => {
                    downloadImage(image.src);
                  }}
                >
                  <img src="/download-icon.png" />
                  だうんろーど
                </button>
                <button
                  className="copy"
                  onClick={() => copyImageToClipboard(image.src)}
                >
                  <img src="/copy-icon.png" />
                  こぴー
                </button>
                <p className="download-copy-text">
                  画像を長押しして保存またはコピーしてね！
                </p>
              </div>
            </div>
          </div>

          <div className="home">
            <h2>そのほかのなかまたち</h2>
            <ul className="home__image-list">
              {otherImages.length > 0 ? (
                otherImages
                  .slice(0, 8)
                  .map((oi) => (
                    <OtherImage
                      key={oi.id}
                      id={oi.id}
                      title={oi.title}
                      src={oi.src}
                      type_id={oi.type.id}
                      type={oi.type}
                    />
                  ))
              ) : (
                <p>{loadingMessage}</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="loading-message">Loading...</div>
      )}
    </>
  );
};

export default ImageDetail;
