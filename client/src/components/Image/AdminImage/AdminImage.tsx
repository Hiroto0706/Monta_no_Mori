import React, { useState } from "react";

import ModalImage from "./AdminModalImage/AdminModalImage";
import { EllipsisText } from "../../Sidebar/UserSidebar/Sidebar";
import {
  Image,
  Category,
  Type,
} from "./../../../pages/Admin/AdminImage/AdminImage";

import "./AdminImage.css";

const ImageList: React.FC<Image & { reFetchImages: () => void }> = ({
  id,
  src,
  title,
  type,
  categories,
  reFetchImages,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageTitleMaxLength] = useState(50);
  const [imgTitle, setImgTitle] = useState(title);
  const [imgSrc, setImgSrc] = useState(src);
  const [imgType, setImgType] = useState(type);
  const [imgCategories, setImgCategories] = useState(categories);

  const toggleOpenModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleEditImage = (
    updatedImage: Image,
    updatedType: Type,
    updatedCategories: Category[]
  ) => {
    setImgTitle(updatedImage.title);
    setImgSrc(updatedImage.src);
    setImgType(updatedType);
    setImgCategories(updatedCategories);
  };

  return (
    <li className="admin-image-box" onClick={() => toggleOpenModal()}>
      <div className="admin-image-box__img admin">
        <img src={imgSrc} alt={imgTitle} />
      </div>
      <div className="admin-image-box__title admin">
        <h3>
          <EllipsisText text={imgTitle} maxLength={imageTitleMaxLength} />
        </h3>
        <div className="type">
          <span>
            <img src={imgType.src} />
            {imgType.name}
          </span>
        </div>
        <div className="category">
          {imgCategories?.map((category: Category) => (
            <span key={category.id}># {category.name}</span>
          ))}
        </div>
      </div>

      {isModalVisible && (
        <ModalImage
          id={id}
          src={imgSrc}
          title={imgTitle}
          type={imgType}
          categories={imgCategories}
          toggleOpenModal={() => toggleOpenModal()}
          onEditSuccess={handleEditImage}
          onDeleteSuccess={() => reFetchImages()}
        />
      )}
    </li>
  );
};

export default ImageList;
