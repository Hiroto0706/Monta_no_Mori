import React, { useState } from "react";

import Image from "./../../../components/Image/AdminImage/AdminImage";
import ImageModal from "./../../../components/Image/AdminImage/AdminModalImage/AdminModalImage";
import AddImageModal from "../../../components/Image/AdminImage/AdminModalAddImage/AdminModalAddImage";

import "./AdminImage.css";

export default function AdminImage() {
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);
  const [isOpenAddImageModal, setIsOpenAddImageModal] = useState(false);

  const toggleIsOpenImageModal = () => {
    setIsOpenImageModal(!isOpenImageModal);
  };
  const toggleIsOpenAddImageModal = () => {
    setIsOpenAddImageModal(!isOpenAddImageModal);
  };

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

            {isOpenImageModal && (
              <ImageModal
                src=""
                title=""
                toggleOpenModal={() => toggleIsOpenImageModal()}
              />
            )}
          </div>
          <ul className="admin-component__image-list">
            <Image />
            <Image />
            <Image />
            <Image />
            <Image />
            <Image />
            <Image />
          </ul>
        </div>
      </div>
    </>
  );
}
