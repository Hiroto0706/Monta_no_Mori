import React from "react";

import "./AdminCategoryModal.css";

interface ModalCategoryProps {
  title: string;
  toggleOpenModal: () => void;
}

const AdminModalCategory: React.FC<ModalCategoryProps> = ({
  title,
  toggleOpenModal,
}) => {
  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div
        className="admin-category-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/public/cancel-icon.png" />
        </button>
        <div className="admin-category-modal__content">
          <div className="title">
            <h3>Category Name</h3>
            <input value={title} />
          </div>

          <div className="button">
            <button className="save">Save</button>
            <button className="delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModalCategory;
