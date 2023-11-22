import React, { useState, useEffect } from "react";

import AdminCategoryModal from "./AdminCategoryModal/AdminCategoryModal";
import { EllipsisText } from "../../../Sidebar/UserSidebar/Sidebar";
import {
  Image,
  Category,
  Type,
} from "./../../../../pages/Admin/AdminImage/AdminImage";
import { fetchTypes } from "../../../../pages/Admin/AdminType/AdminType";

import "./AdminModalImage.css";

interface ModalImageProps {
  toggleOpenModal: () => void;
}

const AdminModalImage: React.FC<Image & ModalImageProps> = ({
  title,
  src,
  type,
  categories,
  toggleOpenModal,
}) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [types, setTypes] = useState<Type[]>([]);

  const handleCategoryModal = () => {
    setIsCategoryModalOpen(!isCategoryModalOpen);
  };
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  useEffect(() => {
    fetchTypes(setTypes);
  }, []);

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div
        className="modal-image__content"
        onClick={(e) => {
          e.stopPropagation();
          closeCategoryModal();
        }}
      >
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/cancel-icon.png" />
        </button>

        <div className="modal-image__content__img default">
          <div>
            <img src={src} alt={title} />
          </div>
          <input type="file" accept="image/*" />
        </div>

        <div className="modal-image__content__desc">
          <div>
            <div className="type">
              <h3>Title</h3>
              <input value={title} placeholder="title" />
            </div>

            <div className="type">
              <h3>Type</h3>
              <label className="selectbox">
                <select value={type.id}>
                  <option>-- Select Type --</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="category">
              <h3>Category</h3>
              {categories?.map((category: Category) => (
                <span key={category.id} className="category-link">
                  # <EllipsisText text={category.name} maxLength={100} />
                  <img
                    src="/cancel-icon.png"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("deselect category");
                    }}
                  />
                </span>
              ))}
              <span
                className="category-link add"
                onClick={(e) => {
                  handleCategoryModal();
                  e.stopPropagation();
                }}
              >
                {isCategoryModalOpen ? "CLOSE" : "+ ADD"}
                {isCategoryModalOpen && (
                  <AdminCategoryModal onClose={handleCategoryModal} />
                )}
              </span>
            </div>
          </div>

          <div className="modal-image__content__desc__button">
            <button className="download">
              <img src="/download-icon.png" />
              Edit
            </button>
            <button className="download delete">
              <img src="/download-icon.png" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModalImage;
