import React from "react";

import Image from "./../../../components/Image/AdminImage/AdminImage";

import "./AdminImage.css";

export default function AdminImage() {
  return (
    <>
      <div className="admin-component">
        <div className="admin-component__inner admin">
          <h2>Image List</h2>
          <ul className="admin-component__image-list">
            <Image />
            <Image />
            <Image />
            <Image />
            <Image />
            <Image />
            <Image />
          </ul>
        </div>
      </div>
    </>
  );
}
