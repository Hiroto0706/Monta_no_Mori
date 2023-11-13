import React, { useState } from "react";
import axios from "axios";

import AdminCategoryModal from "./AdminCategoryModal/AdminCategoryModal";
import { EllipsisText } from "../../../Sidebar/UserSidebar/Sidebar";

import "./../AdminModalImage/AdminModalImage.css";

interface ModalImageProps {
  toggleOpenModal: () => void;
}

const AdminModalAddImage: React.FC<ModalImageProps> = ({ toggleOpenModal }) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  const handleCategoryModal = () => {
    setIsCategoryModalOpen(!isCategoryModalOpen);
  };
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };

  const uploadImage = async () => {
    console.log("type : " + type);
    console.log("title : " + title);
    try {
      const response = await axios.post("http://localhost:8080/admin/upload", {
        title: title,
        type: type,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const deleteCategory = () => {
    console.log("not select this category");
  };

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <form
        className="modal-image__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/cancel-icon.png" />
        </button>

        <div className="modal-image__content__img default">
          <div>
            <img src="/upload-image.png" />
          </div>
        </div>

        <div className="modal-image__content__desc">
          <div className="type">
            <h3>Title</h3>
            <input
              value={title}
              placeholder="input image title"
              onChange={handleTitleChange}
            />
          </div>

          <div className="type">
            <h3>Type</h3>
            <label className="selectbox">
              <select onChange={handleTypeChange} value={type}>
                <option value="">-- Select Type --</option>
                <option value="joke">ネタ画像</option>
                <option value="meet-img">Meet背景</option>
                <option value="stump">スタンプ</option>
              </select>
            </label>
          </div>

          <div className="category">
            <h3>Category</h3>
            <span className="category-link" onClick={deleteCategory}>
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
              <img src="/cancel-icon.png" />
            </span>
            <span className="category-link" onClick={deleteCategory}>
              #
              <EllipsisText text="テストテストテスト" maxLength={100} />
              <img src="/cancel-icon.png" />
            </span>

            <span className="category-link add" onClick={handleCategoryModal}>
              {isCategoryModalOpen ? "CLOSE" : "+ ADD"}
              {isCategoryModalOpen && (
                <AdminCategoryModal onClose={handleCategoryModal} />
              )}
            </span>
          </div>

          <div className="modal-image__content__desc__button">
            <div className="download" onClick={() => uploadImage()}>
              <img src="/download-icon.png" />
              Upload
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminModalAddImage;
