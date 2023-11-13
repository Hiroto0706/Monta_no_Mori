import React from "react";

import "./AdminCategoryModal.css";

interface Props {
  onClose: () => void;
}

const AdminModalImageCategoryModal: React.FC<Props> = ({ onClose }) => {
  return (
    <>
      <div className="category-modal" onClick={onClose}>
        <div
          className="category-modal__inner"
          onClick={(e) => e.stopPropagation()}
        >
          <h4>
            Categories
            <span onClick={onClose}>
              <img src="/cancel-icon.png" />
            </span>
          </h4>
          <ul>
            <li>jklsdflkj</li>
            <li>jklsdflkj</li>
            <li>jklsdflkj</li>
            <li>jklsdflkj</li>
            <li>jklsdflkj</li>
            <li>jklsdflkj</li>
            <li>jklsdflkj</li>
            <li>jklsdflkj</li>
            <li>jklsdflkj</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminModalImageCategoryModal;
