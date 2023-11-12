import React, { useState } from "react";
import ModalCategory from "../../../components/Category/AdminCategory/AdminCategoryModal";
import CategoryList from "./../../../components/Category/AdminCategory/AdminCategoryList";

import "./../AdminImage/AdminImage.css";
import "./../AdminType/AdminType.css";

export default function AdminCategory() {
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);

  const toggleIsOpenCategoryModal = () => {
    setIsOpenCategoryModal(!isOpenCategoryModal);
  };

  return (
    <>
      <div className="admin-component">
        <div className="admin-component__inner admin">
          <div className="admin-component__title">
            <h2>Category List</h2>
            <button>+ Add Category</button>
          </div>
          <ul className="admin-component__image-list">
            <CategoryList
              title="test"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtesttest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtesttest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtesttest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtesttest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="test"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="test"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="test"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="test"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="test"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtesttesttesttest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtesttesttesttest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtesttesttesttest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtesttesttesttest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtesttest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <CategoryList
              title="testtest"
              toggleOpenCategoryModal={() => toggleIsOpenCategoryModal()}
            />
            <li
              className="type-list add"
              onClick={() => toggleIsOpenCategoryModal()}
            >
              + ADD
            </li>
          </ul>
        </div>

        {isOpenCategoryModal && (
          <ModalCategory
            title="test"
            toggleOpenModal={() => toggleIsOpenCategoryModal()}
          />
        )}
      </div>
    </>
  );
}
