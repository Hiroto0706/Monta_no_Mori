import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

import { EllipsisText } from "../../../Sidebar/UserSidebar/Sidebar";
import { UserType } from "../../../../pages/Content/Home/Home";

import "./ModalImage.css";
import "./../../../Sidebar/UserSidebar/Sidebar.css";
import { Link } from "react-router-dom";

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

  const downloadImage = async () => {
    try {
      const response = await axios.get(src, {
        responseType: "blob",
      });
      const fileName = src.substring(src.lastIndexOf("/") + 1);
      saveAs(response.data, fileName);
    } catch (error) {
      console.error("Image download failed", error);
    }
  };

  const copyImageToClipboard = async () => {
    try {
      const response = await axios.get(src, { responseType: "blob" });
      const blob = response.data;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = await createImageBitmap(blob);
      canvas.width = image.width;
      canvas.height = image.height;
      if (ctx) {
        ctx.drawImage(image, 0, 0);
      }

      canvas.toBlob(async (newBlob) => {
        if (newBlob) {
          const clipboardItem = new ClipboardItem({ [newBlob.type]: newBlob });
          await navigator.clipboard.write([clipboardItem]);
          console.log("image copied successfully!");
        }
      }, blob.type);
    } catch (err) {
      console.error("Failed to copy on clipboard", err);
    }
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
  }, []);

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
              <h3>たいぷ</h3>
              <Link
                to={`/search/type/${type.name}`}
                className="type-link-modal"
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
                downloadImage();
              }}
            >
              <img src="/download-icon.png" />
              だうんろーど
            </button>
            <button className="copy" onClick={() => copyImageToClipboard()}>
              <img src="/copy-icon.png" />
              こぴー
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
