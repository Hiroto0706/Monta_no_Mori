import React, { useState } from "react";
import ModalType from "../../../components/Type/AdminType/AdminTypeModal/AdminTypeModal";
import ModalAddType from "../../../components/Type/AdminType/AdminTypeModal/AdminAddTypeModal";
import AdminTypeList from "./../../../components/Type/AdminType/AdminTypeList/AdminTypeList";

import "./../AdminImage/AdminImage.css";
import "./AdminType.css";

export default function AdminType() {
  const [isOpenTypeModal, setIsOpenTypeModal] = useState(false);
  const [isOpenAddTypeModal, setIsOpenAddTypeModal] = useState(false);

  const toggleIsOpenTypeModal = () => {
    setIsOpenTypeModal(!isOpenTypeModal);
  };
  const toggleIsOpenAddTypeModal = () => {
    setIsOpenAddTypeModal(!isOpenAddTypeModal);
  };

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
            <AdminTypeList
              src="/pc-img.png"
              title="もんた"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="テスト"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="テスト"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="テスト"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="ああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="ああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="あああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="あああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="あああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            {/* <li
              className="type-list add"
              onClick={() => toggleIsOpenAddTypeModal()}
            >
              + ADD
            </li> */}
          </ul>
        </div>

        {isOpenTypeModal && (
          <ModalType
            src="/pc-img.png"
            title="test"
            toggleOpenModal={() => toggleIsOpenTypeModal()}
          />
        )}
      </div>
    </>
  );
}
