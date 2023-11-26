import React, { useState, useEffect } from "react";
import axios from "axios";

import { EllipsisText } from "../../../Sidebar/UserSidebar/Sidebar";
import { UserType } from "../../../../pages/Content/Home/Home";

import "./ModalImage.css";
import "./../../../Sidebar/UserSidebar/Sidebar.css";

interface ModalImageProps {
  id: number;
  src: string;
  title: string;
  type: UserType;
  toggleOpenModal: () => void;
  toggleLike: (id: string) => void;
}

interface Category {
  id: number;
  name: string;
}

const ModalImage: React.FC<ModalImageProps> = ({
  id,
  src,
  title,
  type,
  toggleOpenModal,
  toggleLike,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const toggleLikeFromModal = () => {
    toggleLike(id.toString());
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    if (localStorage.getItem("favorites")?.includes(id.toString())) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }

    axios
      .get(`http://localhost:8080/category/${id}`)
      .then((response) => {
        setCategories(response.data.category);
      })
      .catch((error) => {
        console.log("List categories failed:", error);
      });
  }, []);

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div
        className="modal-image__content user-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/cancel-icon.png" />
        </button>

        <div className="modal-image__content__img">
          <div className="img">
            <img src={src} alt={title} />
          </div>
        </div>

        <div className="modal-image__content__desc">
          <div>
            <div className="title">
              <h2>{title} </h2>
              <img
                src={isLiked ? "/heart-icon_1.png" : "/heart-icon_0.png"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLikeFromModal();
                }}
              />
            </div>

            <div className="type">
              <h3>Type</h3>
              <a href="" className="type-link-modal">
                <img src={type.src} />
                <EllipsisText text={type.name} maxLength={100} />{" "}
              </a>
            </div>

            <div className="category">
              <h3>Category</h3>
              {categories.map((category) => (
                <a href="" className="category-link" key={category.id}>
                  #
                  <EllipsisText text={category.name} maxLength={100} />
                </a>
              ))}
            </div>
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
