import React from "react";

import "./AdminTypeList.css";

interface AdminTypeProps {
  id: number;
  src: string;
  title: string;
  toggleOpenTypeModal: () => void;
}

const AdminTypeList: React.FC<AdminTypeProps> = ({
  id,
  src,
  title,
  toggleOpenTypeModal,
}) => {
  return (
    <>
      <li className="type-list" onClick={toggleOpenTypeModal}>
        {id}:<img src={src} />
        {title}
      </li>
    </>
  );
};

export default AdminTypeList;
