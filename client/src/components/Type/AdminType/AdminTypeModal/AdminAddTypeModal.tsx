import React, { ChangeEvent, useState } from "react";
import axios from "axios";

import "./AdminTypeModal.css";

interface ModalTypeProps {
  toggleOpenModal: () => void;
}

const AdminModalType: React.FC<ModalTypeProps> = ({ toggleOpenModal }) => {
  const [name, setName] = useState("");
  const [imageData, setImageData] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
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

  const uploadType = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    console.log(name);
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    try {
      const response = await axios.post(
        "http://localhost:8080/admin/type/upload",
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

  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div className="admin-type-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/cancel-icon.png" />
        </button>
        <div className="admin-type-modal__content">
          <div className="admin-type-modal__content__img">
            <div className="type-icon">
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
          <div className="admin-type-modal__content__desc">
            <div className="title">
              <h3>Type Name</h3>
              <input
                value={name}
                placeholder="input type name"
                onChange={(e) => handleNameChange(e)}
              />
            </div>

            <div className="button">
              <button
                className="save"
                onClick={() => {
                  uploadType();
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModalType;
