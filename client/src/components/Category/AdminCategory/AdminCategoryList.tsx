import React from "react";

import "./../../Type/AdminType/AdminTypeList/AdminTypeList.css";

interface AdminCategoryProps {
  id: number;
  name: string;
  toggleOpenCategoryModal: () => void;
}

const AdminCategoryList: React.FC<AdminCategoryProps> = ({
  name,
  toggleOpenCategoryModal,
}) => {
  return (
    <>
      <li className="type-list" onClick={toggleOpenCategoryModal}>
        # {name}
      </li>
    </>
  );
};

export default AdminCategoryList;
