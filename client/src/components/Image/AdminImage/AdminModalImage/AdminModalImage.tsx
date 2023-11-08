import React, { useState } from "react";

import AdminCategoryModal from "./AdminCategoryModal/AdminCategoryModal";
import { EllipsisText } from "../../../SidebarComponents/Sidebar/Sidebar";

import "./AdminModalImage.css";

interface ModalImageProps {
  src: string;
  title: string;
  toggleOpenModal: () => void;
}

const AdminModalImage: React.FC<ModalImageProps> = ({
  src,
  title,
  toggleOpenModal,
}) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleCategoryModal = () => {
    setIsCategoryModalOpen(!isCategoryModalOpen);
  };

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div
        className="modal-image__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/public/cancel-icon.png" />
        </button>

        <div className="modal-image__content__img">
          <img src={src} alt={title} />
        </div>

        <div className="modal-image__content__desc">
          <div className="type">
            <input value={title} placeholder="title" />
          </div>

          <div className="type">
            <h3>Type</h3>
            <label className="selectbox">
              <select>
                <option>-- Select Type --</option>
                <option>optionの例1</option>
                <option>optionの例2</option>
                <option>optionの例3</option>
              </select>
            </label>
          </div>

          <div className="category">
            <h3>Category</h3>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
            </a>
            <span className="category-link add" onClick={handleCategoryModal}>
              + ADD
              {isCategoryModalOpen && (
                <AdminCategoryModal onClose={handleCategoryModal} />
              )}
            </span>
          </div>

          <div className="modal-image__content__desc__button">
            <button className="download">
              <img src="/public/download-icon.png" />
              Edit
            </button>
            <button className="download delete">
              <img src="/public/download-icon.png" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModalImage;
