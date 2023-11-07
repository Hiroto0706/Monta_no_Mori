import React, { useState } from "react";

import ModalImage from "./Modal/ModalImage";
import { EllipsisText } from "../SidebarComponents/Sidebar/Sidebar";
import "./Image.css";

const Image: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [imageTitleMaxLength] = useState(10);

  const toggleLike = (isLiked: boolean) => {
    setIsLiked(!isLiked);
  };

  const toggleOpenModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <li className="image-box" onClick={() => toggleOpenModal()}>
      <div className="image-box__img">
        <img src="/public/monta_no_mori_icon.png" alt="喜ぶ犬" />
      </div>
      <div className="image-box__title">
        <h3>
          <EllipsisText text="もんたの森" maxLength={imageTitleMaxLength} />
        </h3>
        <img
          src={
            isLiked ? "/public/heart-icon_1.png" : "/public/heart-icon_0.png"
          }
          onClick={(e) => {
            toggleLike(isLiked);
            e.stopPropagation();
          }}
        />
      </div>

      {isModalVisible && (
        <ModalImage
          src="/public/monta_no_mori_icon.png"
          title="もんたの森"
          toggleOpenModal={() => toggleOpenModal()}
        />
      )}
    </li>
  );
};

export default Image;
