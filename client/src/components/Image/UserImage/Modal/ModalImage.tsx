import React, { useState } from "react";

import { EllipsisText } from "../../../Sidebar/UserSidebar/Sidebar";

import "./ModalImage.css";
import "./../../../Sidebar/UserSidebar/Sidebar.css";

interface ModalImageProps {
  src: string;
  title: string;
  toggleOpenModal: () => void;
}

const ModalImage: React.FC<ModalImageProps> = ({
  src,
  title,
  toggleOpenModal,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = (isLiked: boolean) => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div
        className="modal-image__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/cancel-icon.png" />
        </button>

        <div className="modal-image__content__img">
          <img src={src} alt={title} />
        </div>

        <div className="modal-image__content__desc">
          <div className="title">
            <h2>{title} </h2>
            <img
              src={
                isLiked ? "/heart-icon_1.png" : "/heart-icon_0.png"
              }
              onClick={(e) => {
                toggleLike(isLiked);
                e.stopPropagation();
              }}
            />
          </div>

          <div className="type">
            <h3>Type</h3>
            <a href="" className="type-link-modal">
              <img src="/pc-img.png" />
              <EllipsisText
                text="テストテストテストテストテストテストテスト"
                maxLength={100}
              />{" "}
            </a>
          </div>

          <div className="category">
            <h3>Category</h3>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
          </div>

          <div className="modal-image__content__desc__button">
            <button className="download">
              <img src="/download-icon.png" />
              Download
            </button>
            <button className="copy">
              <img src="/copy-icon.png" />
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalImage;
