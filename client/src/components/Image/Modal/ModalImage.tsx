// src/Modal/ModalImage.tsx
import React from "react";
import "./ModalImage.css";

interface ModalImageProps {
  src: string;
  title: string;
  toggleOpenModal: () => void;
}

const ModalImage: React.FC<ModalImageProps> = ({
  src,
  title,
  toggleOpenModal,
}) => {
  return (
    <div className="modal-image__overlay" onClick={toggleOpenModal}>
      <div
        className="modal-image__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={toggleOpenModal}>Close</button>
        <h2>{title}</h2>
        <img src={src} alt={title} />
      </div>
    </div>
  );
};

export default ModalImage;
