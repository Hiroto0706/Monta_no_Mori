// import React, { useState } from "react";

import "./AdminTypeModal.css";

interface ModalTypeProps {
  src: string;
  title: string;
  toggleOpenModal: () => void;
}

const AdminModalType: React.FC<ModalTypeProps> = ({
  src,
  title,
  toggleOpenModal,
}) => {
  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div className="admin-type-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={toggleOpenModal} className="cancel">
          <img src="/cancel-icon.png" />
        </button>
        <div className="admin-type-modal__content">
          <div className="admin-type-modal__content__img">
            <img src={src} />
          </div>
          <div className="admin-type-modal__content__desc">
            <div className="title">
              <h3>Type Name</h3>
              <input value={title} />
            </div>

            <div className="button">
              <button className="save">Save</button>
              <button className="delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModalType;
