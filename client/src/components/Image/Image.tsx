import React, { useState } from "react";

import "./Image.css";
import { EllipsisText } from "../SidebarComponents/Sidebar";

const Image: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = (isLiked: boolean) => {
    setIsLiked(!isLiked);
  };

  return (
    <li className="image-box">
      <div className="image-box__img">
        <img src="public/monta_no_mori_icon.png" />
      </div>
      <div className="image-box__title">
        <h3>
          <EllipsisText text="もんたの森もんたの森もんたの森もんたの森もんたの森"></EllipsisText>
        </h3>
        <img
          src={isLiked ? "public/heart-icon_1.png" : "public/heart-icon_0.png"}
          onClick={() => toggleLike(isLiked)}
        />
      </div>
    </li>
  );
};

export default Image;
