import React, { useState } from "react";

import Image from "./../../../components/Image/AdminImage/AdminImage";
import ImageModal from "./../../../components/Image/AdminImage/AdminModalImage/AdminModalImage";

import "./AdminImage.css";

export default function AdminImage() {
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);

  const toggleIsOpenImageModal = () => {
    setIsOpenImageModal(!isOpenImageModal);
  };

  return (
    <>
      <div className="admin-component">
        <div className="admin-component__inner admin">
          <div className="admin-component__title">
            <h2>Image List</h2>
            <button onClick={() => toggleIsOpenImageModal()}>
              + Add Image
            </button>

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
