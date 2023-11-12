import React, { useState } from "react";
import ModalType from "../../../components/Type/AdminType/AdminTypeModal/AdminTypeModal";
import AdminTypeList from "./../../../components/Type/AdminType/AdminTypeList/AdminTypeList";

import "./../AdminImage/AdminImage.css";
import "./AdminType.css";

export default function AdminType() {
  const [isOpenTypeModal, setIsOpenTypeModal] = useState(false);

  const toggleIsOpenTypeModal = () => {
    setIsOpenTypeModal(!isOpenTypeModal);
  };

  return (
    <>
      <div className="admin-component">
        <div className="admin-component__inner admin">
          <div className="admin-component__title">
            <h2>Type List</h2>
            <button>+ Add Type</button>
          </div>
          <ul className="admin-component__image-list">
            <AdminTypeList
              src="/public/pc-img.png"
              title="もんた"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="テスト"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="テスト"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="テスト"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="ああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="ああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="あああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="あああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="あああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <AdminTypeList
              src="/public/pc-img.png"
              title="ああああああああああああ"
              toggleOpenTypeModal={() => toggleIsOpenTypeModal()}
            />
            <li
              className="type-list add"
              onClick={() => toggleIsOpenTypeModal()}
            >
              + ADD
            </li>
          </ul>
        </div>

        {isOpenTypeModal && (
          <ModalType
            src="/public/pc-img.png"
            title="test"
            toggleOpenModal={() => toggleIsOpenTypeModal()}
          />
        )}
      </div>
    </>
  );
}
