import React from "react";

interface Props {
  onClose: () => void;
}

const AdminModalImageCategoryModal: React.FC<Props> = ({ onClose }) => {
  return (
    <>
      <div onClick={onClose}>this is a modal</div>
    </>
  );
};

export default AdminModalImageCategoryModal;
