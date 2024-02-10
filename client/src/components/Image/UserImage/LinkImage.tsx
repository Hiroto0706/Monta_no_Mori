import React, { useState, useEffect } from "react";

import { EllipsisText } from "../../Sidebar/UserSidebar/Sidebar";
import { UserImage } from "./../../../pages/Content/Home/Home";
import { Link } from "react-router-dom";

import "./Image.css";

const OtherImage: React.FC<UserImage> = ({ id, title, src }) => {
  const [isLiked, setIsLiked] = useState(false);

  const [imageTitleMaxLength] = useState(15);

  useEffect(() => {
    if (localStorage.getItem("favorites")?.includes(id.toString())) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [id]);

  return (
    <Link to={`/image/${title}`} style={{ textDecoration: "none" }}>
      <li className="image-box" onClick={(e) => e.stopPropagation()}>
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
              e.stopPropagation();
            }}
          />
        </div>
      </li>
    </Link>
  );
};

export default OtherImage;
