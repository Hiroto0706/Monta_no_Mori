import React, { useState, useEffect } from "react";
import ModalImage from "./Modal/ModalImage";
import { EllipsisText } from "../../Sidebar/UserSidebar/Sidebar";
import { UserImage } from "./../../../pages/Content/Home/Home";
import axios from "axios";
import "./Image.css";

const Image: React.FC<UserImage & { toggleFavorite: (id: string) => void }> = ({
  id,
  title,
  src,
  type,
  view_count,
  favorite_count,
  toggleFavorite,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewCount, setViewCount] = useState(view_count);
  const [favoriteCount, setFavoriteCount] = useState(favorite_count);
  const [imageTitleMaxLength] = useState(15);

  const toggleLike = (id: string) => {
    toggleFavorite(id);
    if (localStorage.getItem("favorites")?.includes(id)) {
      countUpFavoriteCount(id);
      setIsLiked(true);
    } else {
      countDownFavoriteCount(id);
      setIsLiked(false);
    }
  };

  const countUpViewCount = (newCount: number) => {
    setViewCount(newCount);
  };

  const countUpFavoriteCount = (id: string) => {
    axios
      .put(import.meta.env.VITE_BASE_API + "favorite/count_up", { id })
      .then((response) => {
        const newCount: number = response.data;
        if (newCount) {
          setFavoriteCount(newCount);
        }
      })
      .catch((error) => {
        console.error("Count up favorite count failed:", error);
      });
  };
  const countDownFavoriteCount = (id: string) => {
    axios
      .put(import.meta.env.VITE_BASE_API + "favorite/count_down", { id })
      .then((response) => {
        const newCount: number = response.data;
        if (newCount || newCount === 0) {
          setFavoriteCount(newCount);
        }
      })
      .catch((error) => {
        console.error("Count down favorite count failed:", error);
      });
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
  }, [id]);

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
          view_count={viewCount}
          favorite_count={favoriteCount}
          toggleOpenModal={() => toggleOpenModal()}
          toggleLike={() => toggleLike(id.toString())}
          closeOpeningModal={() => closeOpeningModal()}
          countUpViewCount={countUpViewCount}
        />
      )}
    </li>
  );
};

export default Image;
