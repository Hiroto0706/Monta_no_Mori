import React, { useState } from "react";

import "./../Sidebar/Sidebar.css";
import "./AdminSidebar.css";

interface EllipsisTextProps {
  text: string;
  maxLength: number;
}

export const EllipsisText: React.FC<EllipsisTextProps> = ({
  text,
  maxLength,
}) => {
  const truncatedText =
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  return <span>{truncatedText}</span>;
};

const Sidebar: React.FC = () => {
  const [maxLength] = useState(10);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__inner admin">
          <div className="sidebar__inner__type">
            <h3>Menu</h3>
            <a href="" className="type-link">
              <EllipsisText text="Image" maxLength={maxLength} />{" "}
              <div>
                <img src="public/pc-img.png" />
              </div>
            </a>
            <a href="" className="type-link">
              <EllipsisText text="Type" maxLength={maxLength} />{" "}
              <div>
                <img src="public/pc-img.png" />
              </div>
            </a>
            <a href="" className="type-link">
              <EllipsisText text="Category" maxLength={maxLength} />{" "}
              <div>
                <img src="public/pc-img.png" />
              </div>
            </a>
          </div>

          <a href="" className="type-link logout">
            <EllipsisText text="LOGOUT" maxLength={maxLength} />{" "}
            <div>
              <img src="public/logout-icon.png" />
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;