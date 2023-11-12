import React from "react";

import "./../../Type/AdminType/AdminTypeList/AdminTypeList.css";

interface AdminCategoryProps {
  title: string;
  toggleOpenCategoryModal: () => void;
}

const AdminCategoryList: React.FC<AdminCategoryProps> = ({
  title,
  toggleOpenCategoryModal,
}) => {
  return (
    <>
      <li className="type-list" onClick={toggleOpenCategoryModal}>
        # {title}
      </li>
    </>
  );
};

export default AdminCategoryList;
