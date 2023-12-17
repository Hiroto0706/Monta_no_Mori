import { useState, ChangeEvent } from "react";
import axios from "axios";
import "./AdminTypeModal.css";

interface ModalTypeProps {
  id: number;
  src: string;
  name: string;
  toggleOpenModal: () => void;
  onTypeUpdated: () => void;
}

const AdminModalType: React.FC<ModalTypeProps> = ({
  id,
  src,
  name,
  toggleOpenModal,
  onTypeUpdated,
}) => {
  const [defaultName, setName] = useState(name);
  const [editableName, setEditableName] = useState(name);
  const [editableImagePath, setEditableImagePath] = useState<string>(src);
  const [editableFile, setEditableFile] = useState<File | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableName(event.target.value);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        setEditableImagePath(e.target?.result as string);
      };
      setEditableFile(selectedFile);
      reader.readAsDataURL(selectedFile);
    } else {
      setEditableFile(null);
    }
  };

  const editType = async (id: number) => {
    if (editableName == defaultName && editableFile == null) {
      console.error("there is no diff");
      return;
    }

    const formData = new FormData();
    formData.append("name", editableName);
    if (editableFile) {
      formData.append("file", editableFile);
    }

    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_API + `admin/type/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      setName(response.data.name);
      setEditableName(response.data.name);
      setEditableImagePath(response.data.file);
      onTypeUpdated();
    } catch (error) {
      console.error("Edit type failed:", error);
    }
  };

  const deleteType = async (id: number) => {
    try {
      await axios.delete(
        import.meta.env.VITE_BASE_API + `admin/type/delete/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      onTypeUpdated();
      toggleOpenModal();
    } catch (error) {
      console.error("Delete type failed:", error);
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
              {src != "" ? (
                <img src={editableImagePath} alt="current image" />
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
              <h3>Edit Type ID : {id}</h3>
              <input
                value={editableName}
                onChange={(e) => handleNameChange(e)}
              />
            </div>

            <div className="button">
              <button className="save" onClick={() => editType(id)}>
                Save
              </button>
              <button className="delete" onClick={() => deleteType(id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModalType;
