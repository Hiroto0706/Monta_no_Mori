import React from "react";

import "./AdminTypeList.css"

interface AdminTypeProps {
  src: string;
  title: string;
  toggleOpenTypeModal: () => void;
}

const AdminTypeList: React.FC<AdminTypeProps> = ({
  src,
  title,
  toggleOpenTypeModal,
}) => {
  return (
    <>
      <li className="type-list" onClick={toggleOpenTypeModal}>
        <img src={src} />
        {title}
      </li>
    </>
  );
};

export default AdminTypeList;
