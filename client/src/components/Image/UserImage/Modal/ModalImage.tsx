import React, { useState, useEffect } from "react";
import axios from "axios";

import { EllipsisText } from "../../../Sidebar/UserSidebar/Sidebar";
import { UserType } from "../../../../pages/Content/Home/Home";
import { Link } from "react-router-dom";
import { downloadImage, copyImageToClipboard } from "../../imageUtil";

import "./ModalImage.css";
import "./../../../Sidebar/UserSidebar/Sidebar.css";

interface Props {
  id: number;
  src: string;
  title: string;
  type: UserType;
  view_count: number;
  favorite_count: number;
  toggleOpenModal: () => void;
  toggleLike: (id: string) => void;
  closeOpeningModal: () => void;
  countUpViewCount: (newCount: number) => void;
}

export interface ModalCategory {
  id: number;
  name: string;
}

const ModalImage: React.FC<Props> = ({
  id,
  src,
  title,
  type,
  view_count,
  favorite_count,
  toggleOpenModal,
  toggleLike,
  closeOpeningModal,
  countUpViewCount,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [categories, setCategories] = useState<ModalCategory[]>([]);
  const [copiedText, setCopiedText] = useState<string>("こぴー");
  const [isCopied, setIsCopied] = useState<boolean>(false);

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
      .get(import.meta.env.VITE_BASE_API + `category/${id}`)
      .then((response) => {
        setCategories(response.data.category);
      })
      .catch((error) => {
        console.error("List categories failed:", error);
      });

    axios
      .put(import.meta.env.VITE_BASE_API + "count_up", { id: id.toString() })
      .then((response) => {
        const newCount: number = response.data;
        if (newCount) {
          countUpViewCount(newCount);
        }
      })
      .catch((error) => {
        console.error("CountUpViewCount failed:", error);
      });
  }, [id]);

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div
        className="modal-image__content user-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={toggleOpenModal} className="cancel user-modal">
          <img src="/cancel-icon.png" />
        </button>

        <div className="modal-image__content__img user-modal">
          <div className="img">
            <img src={src} alt={title} />
          </div>
        </div>

        <div className="modal-image__content__desc user-modal">
          <div>
            <div className="title">
              <h2>
                <Link to={`/image/${title}`}>{title}</Link>
              </h2>
              <div className="view-count">
                <img
                  src={isLiked ? "/heart-icon_1.png" : "/heart-icon_0.png"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLikeFromModal();
                  }}
                />
                <span className="count-num">{favorite_count}</span>
              </div>
              <div className="view-count">
                <img src="/watch-icon.png" />
                <span className="count-num">{view_count}</span>
              </div>
            </div>

            <div className="type">
              <h3>たいぷ</h3>
              <Link
                to={`/search/type/${type.name}`}
                className="type-link-modal"
                onClick={() => closeOpeningModal()}
              >
                <img src={type.src} />
                <EllipsisText text={type.name} maxLength={100} />{" "}
              </Link>
            </div>

            <div className="category">
              <h3>かてごり</h3>
              {categories.map((category) => (
                <Link
                  to={`/search/category/${category.name}`}
                  className="category-link"
                  key={category.id}
                  onClick={() => closeOpeningModal()}
                >
                  #
                  <EllipsisText text={category.name} maxLength={100} />
                </Link>
              ))}
            </div>
          </div>

          <div className="modal-image__content__desc__button user-modal">
            <button
              className="download"
              onClick={() => {
                downloadImage(src);
              }}
            >
              <img src="/download-icon.png" />
              だうんろーど
            </button>
            <button
              className="copy"
              onClick={() =>
                copyImageToClipboard(src, setCopiedText, setIsCopied)
              }
            >
              <img src="/copy-icon.png" />
              <span
                style={isCopied ? { color: "#4caf50", fontWeight: "bold" } : {}}
              >
                {copiedText}
              </span>
            </button>
            <p className="download-copy-text">
              画像を長押しして保存またはコピーしてね！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalImage;
