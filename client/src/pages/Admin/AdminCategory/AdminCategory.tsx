import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import ModalCategory from "../../../components/Category/AdminCategory/AdminCategoryModal";
import ModalAddCategory from "./../../../components/Category/AdminCategory/AdminAddCategoryModal";
import CategoryList from "./../../../components/Category/AdminCategory/AdminCategoryList";
import { IsLoggedIn } from "../AdminHome/AdminHome";

import "./../AdminImage/AdminImage.css";
import "./../AdminType/AdminType.css";
import "./AdminCategory.css";

export interface BasicCategory {
  id: number;
  name: string;
}

export default function AdminCategory() {
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [isOpenAddCategoryModal, setIsOpenAddCategoryModal] = useState(false);

  const [categories, setCategories] = useState<BasicCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<BasicCategory | null>(null);

  const navigate = useNavigate();

  const toggleIsOpenCategoryModal = () => {
    setIsOpenCategoryModal(!isOpenCategoryModal);
  };
  const toggleIsOpenAddCategoryModal = () => {
    setIsOpenAddCategoryModal(!isOpenAddCategoryModal);
  };

  const selectCategory = (category: BasicCategory) => {
    setSelectedCategory(category);
    toggleIsOpenCategoryModal();
  };

  useEffect(() => {
    fetchCategories(setCategories);
    IsLoggedIn(localStorage.getItem("access_token"), navigate);
  }, [navigate]);

  return (
    <>
      <div className="admin-component">
        <div className="admin-component__inner admin">
          <div className="admin-component__title category">
            <h2>Category List</h2>
            <button onClick={() => toggleIsOpenAddCategoryModal()}>
              + Add Category
            </button>
          </div>

          {isOpenAddCategoryModal && (
            <ModalAddCategory
              toggleOpenModal={() => toggleIsOpenAddCategoryModal()}
            />
          )}

          <ul className="admin-component__image-list">
            {categories.map((category) => (
              <CategoryList
                key={category.id}
                id={category.id}
                name={category.name}
                toggleOpenCategoryModal={() => selectCategory(category)}
              />
            ))}
          </ul>
        </div>

        {isOpenCategoryModal && selectedCategory && (
          <ModalCategory
            id={selectedCategory.id}
            name={selectedCategory.name}
            toggleOpenModal={() => toggleIsOpenCategoryModal()}
            onCategoryUpdated={() => fetchCategories(setCategories)}
          />
        )}
      </div>
    </>
  );
}

export const fetchCategories = <T extends BasicCategory>(
  setCategories: React.Dispatch<React.SetStateAction<T[]>>,
  transformData?: (data: BasicCategory[]) => T[]
) => {
  axios
    .get(import.meta.env.VITE_BASE_URL + "admin/category/", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
    .then((response) => {
      const data = response.data.category;
      setCategories(transformData ? transformData(data) : data);
    })
    .catch((error) => {
      console.error("List categories failed:", error);
    });
};
