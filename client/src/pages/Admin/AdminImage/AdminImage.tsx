import React, { useEffect, useState } from "react";

import axios from "axios";

import ImageList from "./../../../components/Image/AdminImage/AdminImage";
import AddImageModal from "../../../components/Image/AdminImage/AdminModalAddImage/AdminModalAddImage";

import "./AdminImage.css";

export interface Category {
  id: number;
  name: string;
}

export interface Type {
  id: number;
  name: string;
  src: string;
}

export interface Image {
  id: number;
  src: string;
  title: string;
  type: Type;
  categories?: Category[];
}

interface responsePayload {
  image: Image;
  type: Type;
  categories: Category[];
}

export default function AdminImage() {
  const [isOpenAddImageModal, setIsOpenAddImageModal] = useState(false);

  const [images, setImages] = useState<Image[]>([]);

  const toggleIsOpenAddImageModal = () => {
    setIsOpenAddImageModal(!isOpenAddImageModal);
  };

  useEffect(() => {
    fetchImages(setImages);
  }, []);

  return (
    <>
      <div className="admin-component">
        <div className="admin-component__inner admin">
          <div className="admin-component__title">
            <h2>Image List</h2>
            <button
              onClick={() => toggleIsOpenAddImageModal()}
              className="add-button"
            >
              + Add Image
            </button>

            {isOpenAddImageModal && (
              <AddImageModal
                toggleOpenModal={() => toggleIsOpenAddImageModal()}
              />
            )}
          </div>
          <ul className="admin-component__image-list">
            {images.map((image) => (
              <ImageList
                key={image.id}
                id={image.id}
                src={image.src}
                title={image.title}
                type={image.type}
                categories={image.categories}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export const fetchImages = (
  setImages: React.Dispatch<React.SetStateAction<Image[]>>
) => {
  axios
    .get("http://localhost:8080/admin/")
    .then((response) => {
      const responsePayload = response.data.payload;
      const transformedImages = responsePayload.map(transformPayloadToImage);
      console.log(transformedImages);
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
    type: payload.type,
    categories: payload.categories,
  };
};
