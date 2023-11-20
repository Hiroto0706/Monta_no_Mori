import React, { useState, useEffect } from "react";
import axios from "axios";

import ModalType from "../../../components/Type/AdminType/AdminTypeModal/AdminTypeModal";
import ModalAddType from "../../../components/Type/AdminType/AdminTypeModal/AdminAddTypeModal";
import AdminTypeList from "./../../../components/Type/AdminType/AdminTypeList/AdminTypeList";

import "./../AdminImage/AdminImage.css";
import "./AdminType.css";

interface Type {
  id: number;
  src: string;
  name: string;
}

export default function AdminType() {
  const [isOpenTypeModal, setIsOpenTypeModal] = useState(false);
  const [isOpenAddTypeModal, setIsOpenAddTypeModal] = useState(false);

  const [types, setTypes] = useState<Type[]>([]);
  const [selectedType, setSelectedType] = useState<Type | null>(null);

  const toggleIsOpenTypeModal = () => {
    setIsOpenTypeModal(!isOpenTypeModal);
  };
  const toggleIsOpenAddTypeModal = () => {
    setIsOpenAddTypeModal(!isOpenAddTypeModal);
  };

  const selectType = (type: Type) => {
    setSelectedType(type);
    toggleIsOpenTypeModal();
  };

  useEffect(() => {
    fetchTypes(setTypes);
  }, []);

  return (
    <>
      <div className="admin-component">
        <div className="admin-component__inner admin">
          <div className="admin-component__title">
            <h2>Type List</h2>
            <button
              className="add-type"
              onClick={() => toggleIsOpenAddTypeModal()}
            >
              + Add Type
            </button>
          </div>

          {isOpenAddTypeModal && (
            <ModalAddType toggleOpenModal={() => toggleIsOpenAddTypeModal()} />
          )}

          <ul className="admin-component__image-list">
            {types.map((type) => (
              <AdminTypeList
                key={type.id}
                id={type.id}
                src={type.src}
                title={type.name}
                toggleOpenTypeModal={() => selectType(type)}
              />
            ))}

            {isOpenTypeModal && selectedType && (
              <ModalType
                id={selectedType.id}
                src={selectedType.src}
                name={selectedType.name}
                toggleOpenModal={() => toggleIsOpenTypeModal()}
                onTypeUpdated={() => fetchTypes(setTypes)}
              />
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export const fetchTypes = (
  setTypes: React.Dispatch<React.SetStateAction<Type[]>>
) => {
  axios
    .get("http://localhost:8080/admin/type/")
    .then((response) => {
      setTypes(response.data.types);
    })
    .catch((error) => {
      console.log("List types failed:", error);
    });
};
