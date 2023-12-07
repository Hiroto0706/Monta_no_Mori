import React, { useState } from "react";

import axios from "axios";

import "./AdminCategoryModal.css";

interface ModalCategoryProps {
  toggleOpenModal: () => void;
}

const AdminModalCategory: React.FC<ModalCategoryProps> = ({
  toggleOpenModal,
}) => {
  const [name, setName] = useState<string>("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addCategory = async () => {
    if (!name) {
      console.error("category name is required");
    }

    const formData = new FormData();
    formData.append("name", name);

    try {
      await axios.post("http://localhost:8080/api/v1/admin/category/create", formData);
    } catch (error) {
      console.error("create category failed:", error);
    }
  };

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <form
        className="admin-category-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={() => addCategory()}
      >
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/cancel-icon.png" />
        </button>
        <div className="admin-category-modal__content">
          <div className="title">
            <h3>New Category Name</h3>
            <input
              value={name}
              placeholder="Input new category name."
              onChange={(e) => handleNameChange(e)}
            />
          </div>

          <div className="button">
            <button className="save" type="submit">
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminModalCategory;
