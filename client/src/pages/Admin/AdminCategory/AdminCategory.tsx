import React, { useState, useEffect } from "react";

import axios from "axios";

import ModalCategory from "../../../components/Category/AdminCategory/AdminCategoryModal";
import ModalAddCategory from "./../../../components/Category/AdminCategory/AdminAddCategoryModal";
import CategoryList from "./../../../components/Category/AdminCategory/AdminCategoryList";

import "./../AdminImage/AdminImage.css";
import "./../AdminType/AdminType.css";
import "./AdminCategory.css";

interface Category {
  id: number;
  name: string;
}

export default function AdminCategory() {
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [isOpenAddCategoryModal, setIsOpenAddCategoryModal] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const toggleIsOpenCategoryModal = () => {
    setIsOpenCategoryModal(!isOpenCategoryModal);
  };
  const toggleIsOpenAddCategoryModal = () => {
    setIsOpenAddCategoryModal(!isOpenAddCategoryModal);
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    toggleIsOpenCategoryModal();
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:8080/admin/category/")
      .then((response) => {
        setCategories(response.data.category);
      })
      .catch((error) => {
        console.log("List categories failed:", error);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
            onCategoryUpdated={() => fetchCategories()}
          />
        )}
      </div>
    </>
  );
}
