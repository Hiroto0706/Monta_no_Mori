import React, { useState, useEffect } from "react";
import axios from "axios";

import AdminCategoryModal from "./AdminCategoryModal/AdminCategoryModal";
import { EllipsisText } from "../../../Sidebar/UserSidebar/Sidebar";
import { fetchTypes } from "./../../../../pages/Admin/AdminType/AdminType";
import { fetchCategories } from "./../../../../pages/Admin/AdminCategory/AdminCategory";

import "./../AdminModalImage/AdminModalImage.css";

interface ModalImageProps {
  toggleOpenModal: () => void;
}

interface Type {
  id: number;
  src: string;
  name: string;
}
interface Category {
  id: number;
  name: string;
  selected: boolean;
}

const AdminModalAddImage: React.FC<ModalImageProps> = ({ toggleOpenModal }) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | string>(""); //select boxの初期値はstringのため
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageData, setImageData] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

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
    setSelectedTypeId(event.target.value);
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
    formData.append("typeId", selectedTypeId.toString());
    const selectedCategories = categories.filter(
      (category) => category.selected
    );
    selectedCategories.forEach((category) => {
      formData.append("categories", `${category.id}:${category.name}`);
    });

    try {
      await axios.post("http://localhost:8080/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    fetchTypes(setTypes);
    fetchCategories<Category>(setCategories, (data) =>
      data.map((category) => ({ ...category, selected: false }))
    );
  }, []);

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <form
        className="modal-image__content"
        onClick={(e) => {
          e.stopPropagation();
          closeCategoryModal();
        }}
        onSubmit={() => {
          uploadImage();
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
                <select onChange={handleTypeChange} value={selectedTypeId}>
                  <option value="">-- Select Type --</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
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
            <button className="download" type="submit">
              <img src="/download-icon.png" />
              Upload
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminModalAddImage;
