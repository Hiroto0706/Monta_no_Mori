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
    if (!window.confirm("この内容で作成してもよろしいですか？")) return;

    if (!name) {
      alert("category name is required");
    }

    const formData = new FormData();
    formData.append("name", name);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BASE_API + "admin/category/create",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      if (response.status === 200) alert("Success");
    } catch (error) {
      alert("create category failed:" + error);
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
