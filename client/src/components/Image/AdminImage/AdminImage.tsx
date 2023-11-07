import React, { useState } from "react";

import ModalImage from "./../Modal/ModalImage";
import { EllipsisText } from "./../../SidebarComponents/Sidebar/Sidebar";

import "./AdminImage.css";

const Image: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [imageTitleMaxLength] = useState(10);

  const toggleOpenModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <li className="admin-image-box" onClick={() => toggleOpenModal()}>
      <div className="admin-image-box__img admin">
        <img src="/public/monta_no_mori_icon.png" alt="喜ぶ犬" />
      </div>
      <div className="admin-image-box__title admin">
        <h3>
          <EllipsisText text="もんたの森" maxLength={imageTitleMaxLength} />
        </h3>
        <div className="type">
          <span>
            <img src="/public/pc-img.png" />
            type
          </span>
        </div>
        <div className="category">
          <span>#category</span>
          <span>#fadsfasd</span>
          <span>#fdsa</span>
          <span>#sfd</span>
          <span>#safdfdsfdsa</span>
          <span>#fads</span>
          <span>#fads</span>
          <span>#fads</span>
          <span>#fads</span>
          <span>#fads</span>
          <span>#fads</span>
          <span>#fsdafdsa</span>
        </div>
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
