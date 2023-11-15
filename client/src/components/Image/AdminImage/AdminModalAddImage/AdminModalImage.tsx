import React, { useState, ChangeEvent } from "react";
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
  const [imageData, setImageData] = useState<string>("/upload-image.png");
  const [file, setFile] = useState<File | null>(null);

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
    if (!file) {
      console.error("No file selected");
      return;
    }

    console.log("type : " + type);
    console.log("title : " + title);
    console.log("file : " + file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("type", type);

    try {
      const response = await axios.post(
        "http://localhost:8080/admin/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const deleteCategory = () => {
    console.log("not select this category");
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log(files);
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImageData(e.target?.result as string);
        console.log(e.target?.result as string);
        console.log("image uploaded successfully");
      };
      setFile(selectedFile);
      reader.readAsDataURL(selectedFile);
    } else {
      setImageData("/upload-image.png");
      setFile(null);
    }
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
            <img src={imageData} alt="upload image" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              onFileChange(e);
            }}
          />
        </div>

        <div className="modal-image__content__desc">
          <div>
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
