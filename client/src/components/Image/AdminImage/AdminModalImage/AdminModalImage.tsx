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

const AdminModalEditImage: React.FC<
  Image &
    ModalImageProps & {
      onEditSuccess: (
        updatedImage: Image,
        updatedType: Type,
        updatedCategories: Category[]
      ) => void;
      onDeleteSuccess: () => void;
    }
> = ({
  id,
  src,
  title,
  filename,
  type,
  categories,
  toggleOpenModal,
  onEditSuccess,
  onDeleteSuccess,
}) => {
  const [editableTitle, setEditableTitle] = useState<string>(title);
  const [editableFilename, setEditableFilename] = useState<string>(filename);
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
  const handleFilenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableFilename(event.target.value);
  };
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTypeId(event.target.value);
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

  // フロントの画像データをサーバーに送信する
  const editImage = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!window.confirm("この内容で更新してもよろしいですか？")) return;

    const formData = new FormData();
    formData.append("title", editableTitle);
    formData.append("filename", editableFilename);
    formData.append("typeId", selectedTypeId.toString());
    const selectedCategories = editableCategories.filter((c) => c.selected);
    selectedCategories.forEach((category) => {
      formData.append("categories", `${category.id}:${category.name}`);
    });
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_API + `admin/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      if (response.data) {
        alert("Success");
        onEditSuccess(
          response.data.image,
          types.filter((type) => type.id === response.data.image.type_id)[0],
          selectedCategories
        );
        toggleOpenModal();
      }
    } catch (error) {
      alert("Upload image failed:" + error);
    }
  };

  const deleteImage = async (id: number) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      const response = await axios.delete(
        import.meta.env.VITE_BASE_API + `admin/delete/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      if (response.status === 200) {
        alert("success");
        onDeleteSuccess();
      }
    } catch (error) {
      alert("Delete image failed:" + error);
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
        className="modal-image__content admin"
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
                value={editableTitle}
                placeholder="input image title"
                onChange={handleTitleChange}
              />
            </div>
            <div className="type">
              <h3>Filename</h3>
              <input
                value={editableFilename}
                placeholder="input image filename"
                onChange={handleFilenameChange}
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
              </span>

              {isCategoryModalOpen && (
                <AdminCategoryModal
                  onClose={handleCategoryModal}
                  categories={editableCategories}
                  onCategoryChange={handleCategoryChange}
                />
              )}
            </div>
          </div>

          <div className="modal-image__content__desc__button">
            <button className="download" onClick={(e) => editImage(e)}>
              <img src="/download-icon.png" />
              Upload
            </button>
            <button
              className="download delete"
              onClick={() => {
                deleteImage(id);
              }}
            >
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
