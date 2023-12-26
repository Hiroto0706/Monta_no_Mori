import React, { useState, useEffect } from "react";
import { UserImage, UserType } from "../Home/Home";
import { ModalCategory } from "../../../components/Image/UserImage/Modal/ModalImage";

import axios from "axios";

import "./ImageDetail.css";

const ImageDetail: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [image, setImage] = useState<UserImage | null>(null);
  const [type, setType] = useState<UserType | null>(null);
  const [categories, setCategories] = useState<ModalCategory[]>([]);

  const toggleLike = (id: string) => {
    if (localStorage.getItem("favorites")?.includes(id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
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

  return (
    <>
      <div className="image-detail">
        <h2>Hello world</h2>
        <div className="modal-image__content__img user-modal">
          <div className="img">
            {image ? (
              <img src={image.src} alt={image.title} />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageDetail;
