import React, { useState, useEffect } from "react";
import axios from "axios";

import { BasicCategory } from "../../../pages/Admin/AdminCategory/AdminCategory";
import { Type } from "../../../pages/Admin/AdminType/AdminType";
import { Link } from "react-router-dom";
import LoaderSpinner from "../../Common/Loader";

import "./HeaderMenu.css";

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

interface HeaderProps {
  closeHeader: () => void;
}
const HeaderMenu: React.FC<HeaderProps> = ({ closeHeader }) => {
  const [typeMaxLength] = useState(15);
  const [categoryMaxLength] = useState(15);

  const [categories, setCategories] = useState<BasicCategory[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  const loaderWidth: number = 30;

  const handleHeaderMenu = () => {
    closeHeader();
  };

  useEffect(() => {
    fetchTypes(setTypes);
    fetchCategories(setCategories);
  }, []);

  return (
    <>
      <div className="header-menu">
        <div className="header-menu__inner">
          <Link
            className="header-menu__inner__favorite"
            to="/favorite"
            onClick={handleHeaderMenu}
          >
            <span>おきにいり</span>
            <span className="arrow-right"></span>
          </Link>
          <div className="header-menu__inner__type">
            <h3>たいぷ</h3>
            {types.length > 0 ? (
              <>
                {types.map((type) => (
                  <Link
                    to={`/search/type/${type.name}`}
                    className="type-link"
                    key={type.id}
                    onClick={handleHeaderMenu}
                  >
                    <EllipsisText text={type.name} maxLength={typeMaxLength} />
                    <div>
                      <img src={type.src} />
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <LoaderSpinner
                width={loaderWidth}
                height={loaderWidth}
                message={"たいぷはみつかりませんでした！"}
              />
            )}
          </div>

          <div className="header-menu__inner__category">
            <h3>かてごり</h3>
            {categories.length > 0 ? (
              <>
                {categories.map((category) => (
                  <Link
                    to={`/search/category/${category.name}`}
                    className="category-link"
                    key={category.id}
                    onClick={handleHeaderMenu}
                  >
                    #
                    <EllipsisText
                      text={category.name}
                      maxLength={categoryMaxLength}
                    />
                  </Link>
                ))}
              </>
            ) : (
              <LoaderSpinner
                width={loaderWidth}
                height={loaderWidth}
                message={"かてごりはみつかりませんでした！"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;

const fetchTypes = (setTypes: React.Dispatch<React.SetStateAction<Type[]>>) => {
  axios
    .get(import.meta.env.VITE_BASE_API + "type")
    .then((response) => {
      setTypes(response.data.types);
    })
    .catch((error) => {
      console.error("List types failed:", error);
    });
};

const fetchCategories = <T extends BasicCategory>(
  setCategories: React.Dispatch<React.SetStateAction<T[]>>,
  transformData?: (data: BasicCategory[]) => T[]
) => {
  axios
    .get(import.meta.env.VITE_BASE_API + "category")
    .then((response) => {
      const data = response.data.category;
      setCategories(transformData ? transformData(data) : data);
    })
    .catch((error) => {
      console.error("List categories failed:", error);
    });
};
