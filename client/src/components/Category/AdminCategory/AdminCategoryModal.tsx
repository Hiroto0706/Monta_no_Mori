import React, { useState } from "react";
import axios from "axios";

import "./AdminCategoryModal.css";

interface ModalCategoryProps {
  id: number;
  name: string;
  toggleOpenModal: () => void;
  onCategoryUpdated: () => void;
}

const AdminModalCategory: React.FC<ModalCategoryProps> = ({
  id,
  name,
  toggleOpenModal,
  onCategoryUpdated,
}) => {
  const [defaultName, setName] = useState(name);
  const [editableName, setEditableName] = useState(name);

  const handleCategoryName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableName(event.target.value);
  };

  const editCategory = async (id: number) => {
    if (!window.confirm("この内容で更新してもよろしいですか？")) return;

    if (defaultName == editableName) {
      alert("there is no diff");
      return;
    }

    const formData = new FormData();
    formData.append("name", editableName);

    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_API + `admin/category/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      if (response.status === 200) {
        alert("Success");
        setName(response.data.category.name);
        setEditableName(response.data.category.name);
        onCategoryUpdated();
      }
    } catch (error) {
      alert("Edit type failed:" + error);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      const response = await axios.delete(
        import.meta.env.VITE_BASE_API + `admin/category/delete/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      if (response.status === 200) {
        alert("Success");
        onCategoryUpdated();
        toggleOpenModal();
      }
    } catch (error) {
      alert("Delete category failed:" + error);
    }
  };

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div
        className="admin-category-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/cancel-icon.png" />
        </button>
        <div className="admin-category-modal__content">
          <div className="title">
            <h3>Edit Category ID : {id}</h3>
            <input
              value={editableName}
              placeholder="edit category name"
              onChange={(e) => handleCategoryName(e)}
            />
          </div>

          <div className="button">
            <button className="save" onClick={() => editCategory(id)}>
              Edit
            </button>
            <button className="delete" onClick={() => deleteCategory(id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModalCategory;
