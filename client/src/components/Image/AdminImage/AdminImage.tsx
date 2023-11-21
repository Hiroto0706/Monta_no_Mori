import React, { useState } from "react";

import ModalImage from "./AdminModalImage/AdminModalImage";
import { EllipsisText } from "../../Sidebar/UserSidebar/Sidebar";
import { Image, Category } from "./../../../pages/Admin/AdminImage/AdminImage";

import "./AdminImage.css";

const ImageList: React.FC<Image> = ({ src, title, type, categories }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [imageTitleMaxLength] = useState(10);

  const toggleOpenModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <li className="admin-image-box" onClick={() => toggleOpenModal()}>
      <div className="admin-image-box__img admin">
        <img src={src} alt={title} />
      </div>
      <div className="admin-image-box__title admin">
        <h3>
          <EllipsisText text={title} maxLength={imageTitleMaxLength} />
        </h3>
        <div className="type">
          <span>
            <img src={type.src} />
            {type.name}
          </span>
        </div>
        <div className="category">
          {categories?.map((category: Category) => (
            <span key={category.id}># {category.name}</span>
          ))}
        </div>
      </div>

      {isModalVisible && (
        <ModalImage
          src={src}
          title={title}
          toggleOpenModal={() => toggleOpenModal()}
        />
      )}
    </li>
  );
};

export default ImageList;
