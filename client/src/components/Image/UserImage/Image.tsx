import React, { useState, useEffect } from "react";

import ModalImage from "./Modal/ModalImage";

import { EllipsisText } from "../../Sidebar/UserSidebar/Sidebar";
import { UserImage } from "./../../../pages/Content/Home/Home";

import "./Image.css";

const Image: React.FC<UserImage & { toggleFavorite: (id: string) => void }> = ({
  id,
  title,
  src,
  type,
  toggleFavorite,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [imageTitleMaxLength] = useState(15);

  const toggleLike = (id: string) => {
    toggleFavorite(id);
    if (localStorage.getItem("favorites")?.includes(id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  };

  const toggleOpenModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const closeOpeningModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (localStorage.getItem("favorites")?.includes(id.toString())) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, []);

  return (
    <li className="image-box" onClick={() => toggleOpenModal()}>
      <div className="image-box__img">
        <img src={src} alt={title} />
      </div>
      <div className="image-box__title">
        <h3>
          <EllipsisText text={title} maxLength={imageTitleMaxLength} />
        </h3>
        <img
          src={isLiked ? "/heart-icon_1.png" : "/heart-icon_0.png"}
          onClick={(e) => {
            toggleLike(id.toString());
            e.stopPropagation();
          }}
        />
      </div>

      {isModalVisible && (
        <ModalImage
          id={id}
          src={src}
          title={title}
          type={type}
          toggleOpenModal={() => toggleOpenModal()}
          toggleLike={() => toggleLike(id.toString())}
          closeOpeningModal={() => closeOpeningModal()}
        />
      )}
    </li>
  );
};

export default Image;
