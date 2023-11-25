import React, { useState, useEffect } from "react";

import {
  fetchCategories,
  BasicCategory,
} from "../../../pages/Admin/AdminCategory/AdminCategory";
import { fetchTypes, Type } from "../../../pages/Admin/AdminType/AdminType";

import "./Sidebar.css";

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
  const [typeMaxLength] = useState(10);
  const [categoryMaxLength] = useState(15);

  const [categories, setCategories] = useState<BasicCategory[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  useEffect(() => {
    fetchCategories(setCategories);
    fetchTypes(setTypes);
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__inner__type">
            <h3>Type</h3>
            {types.map((type) => (
              <a href="" className="type-link">
                <EllipsisText text={type.name} maxLength={typeMaxLength} />
                <div>
                  <img src={type.src} />
                </div>
              </a>
            ))}
          </div>

          <div className="sidebar__inner__category">
            <h3>Category</h3>
            {categories.map((category) => (
              <a href="" className="category-link">
                #
                <EllipsisText
                  text={category.name}
                  maxLength={categoryMaxLength}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
