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
  const [imageData, setImageData] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState([
    { id: 1, name: "Category 1", selected: false },
    { id: 2, name: "Category 2", selected: false },
    { id: 3, name: "Category 3", selected: false },
    { id: 4, name: "Category 4", selected: false },
    { id: 5, name: "Category 5", selected: false },
    { id: 6, name: "Category 6", selected: false },
    { id: 7, name: "Category 7", selected: false },
    { id: 8, name: "Category 8", selected: false },
    { id: 9, name: "Category 9", selected: false },
  ]);

  // カテゴリモーダルの状態管理
  const handleCategoryModal = () => {
    setIsCategoryModalOpen(!isCategoryModalOpen);
  };
  // カテゴリモーダルのCLose
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };
  // カテゴリの選択状態の管理
  const handleCategoryChange = (categoryId: number) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? { ...category, selected: !category.selected }
          : category
      )
    );
  };
  // カテゴリの選択を解除するハンドラー
  const handleCategoryDeselect = (categoryId: number) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId ? { ...category, selected: false } : category
      )
    );
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };

  // フロントの画像データをサーバーに送信する
  const uploadImage = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("type", type);
    const selectedCategories = categories.filter(
      (category) => category.selected
    );
    selectedCategories.forEach((category) => {
      formData.append("categories", `${category.id}:${category.name}`);
    });

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

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImageData(e.target?.result as string);
      };
      setFile(selectedFile);
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
    }
  };

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <form
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
            {imageData != "" ? (
              <img src={imageData} alt="upload image" />
            ) : (
              <span>Upload image</span>
            )}
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
              {categories
                .filter((category) => category.selected)
                .map((category) => (
                  <span key={category.id} className="category-link">
                    # <EllipsisText text={category.name} maxLength={100} />
                    <img
                      src="/cancel-icon.png"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryDeselect(category.id);
                      }}
                    />
                  </span>
                ))}

              {/* カテゴリーのADDとClose処理 */}
              <span
                className="category-link add"
                onClick={(e) => {
                  handleCategoryModal();
                  e.stopPropagation();
                }}
              >
                {isCategoryModalOpen ? "CLOSE" : "+ ADD"}
                {isCategoryModalOpen && (
                  <AdminCategoryModal
                    onClose={handleCategoryModal}
                    categories={categories}
                    onCategoryChange={handleCategoryChange}
                  />
                )}
              </span>
            </div>
          </div>

          <div className="modal-image__content__desc__button">
            <div
              className="download"
              onClick={() => {
                uploadImage();
              }}
            >
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
