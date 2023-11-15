import React from "react";

import "./../../AdminModalImage/AdminCategoryModal/AdminCategoryModal.css";

interface Props {
  onClose: () => void;
  categories: { id: number; name: string; selected: boolean }[];
  onCategoryChange: (categoryId: number) => void;
}

const AdminModalImageCategoryModal: React.FC<Props> = ({
  onClose,
  categories,
  onCategoryChange,
}) => {
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
            {categories.map((category) => (
              <li key={category.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={category.selected}
                    onChange={() => onCategoryChange(category.id)}
                  />
                  # {category.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminModalImageCategoryModal;
