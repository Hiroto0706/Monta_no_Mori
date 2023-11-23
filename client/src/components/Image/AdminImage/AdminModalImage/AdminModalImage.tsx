import React, { useState, useEffect } from "react";
import axios from "axios";

import AdminCategoryModal from "./AdminCategoryModal/AdminCategoryModal";
import { EllipsisText } from "../../../Sidebar/UserSidebar/Sidebar";
import { Image, Type } from "../../../../pages/Admin/AdminImage/AdminImage";
import { fetchTypes } from "./../../../../pages/Admin/AdminType/AdminType";
import {
  BasicCategory,
  fetchCategories,
} from "../../../../pages/Admin/AdminCategory/AdminCategory";

import "./AdminModalImage.css";

interface ModalImageProps {
  toggleOpenModal: () => void;
}

interface Category {
  id: number;
  name: string;
  selected: boolean;
}

const AdminModalEditImage: React.FC<Image & ModalImageProps> = ({
  id,
  src,
  title,
  type,
  categories,
  toggleOpenModal,
}) => {
  const [editableTitle, setEditableTitle] = useState<string>(title);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | string>(
    type.id
  );
  const [editableCategories, setEditableCategories] = useState<Category[]>([]);
  const [imageData, setImageData] = useState<string>(src);
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
    setEditableCategories(
      editableCategories.map((category) =>
        category.id === categoryId
          ? { ...category, selected: !category.selected }
          : category
      )
    );
  };
  // カテゴリの選択を解除するハンドラー
  const handleCategoryDeselect = (categoryId: number) => {
    setEditableCategories(
      editableCategories.map((category) =>
        category.id === categoryId ? { ...category, selected: false } : category
      )
    );
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(event.target.value);
  };
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTypeId(event.target.value);
  };

  // フロントの画像データをサーバーに送信する
  const editImage = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("file", file);
    formData.append("title", title);
    formData.append("typeId", selectedTypeId.toString());
    const selectedCategories = editableCategories.filter((c) => c.selected);
    selectedCategories.forEach((category) => {
      formData.append("categories", `${category.id}:${category.name}`);
    });

    console.log(selectedCategories);

    try {
      const response = await axios.post(
        "http://localhost:8080/admin/edit",
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
    // 親コンポーネントから受け取ったカテゴリのIDを取得
    const parentCategoryIds = new Set(categories.map((cat) => cat.id));

    // データベースからカテゴリを取得し、変換する関数
    const transformCategories = (dbCategories: BasicCategory[]) => {
      return dbCategories.map((dbCat) => ({
        ...dbCat,
        selected: parentCategoryIds.has(dbCat.id),
      }));
    };

    fetchCategories<Category>(setEditableCategories, transformCategories);
    fetchTypes(setTypes);
  }, [categories]);

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div
        className="modal-image__content"
        onClick={(e) => {
          e.stopPropagation();
          closeCategoryModal();
        }}
        onSubmit={() => {
          editImage();
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
                value={editableTitle}
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
              {editableCategories
                .filter((c) => c.selected)
                .map((cat) => (
                  <span key={cat.id} className="category-link">
                    # <EllipsisText text={cat.name} maxLength={100} />
                    <img
                      src="/cancel-icon.png"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryDeselect(cat.id);
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
                    categories={editableCategories}
                    onCategoryChange={handleCategoryChange}
                  />
                )}
              </span>
            </div>
          </div>

          <div className="modal-image__content__desc__button">
            <button
              className="download"
              type="submit"
              onClick={() => {
                editImage();
              }}
            >
              <img src="/download-icon.png" />
              Upload
            </button>
            <button className="download delete" type="submit">
              <img src="/download-icon.png" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModalEditImage;
