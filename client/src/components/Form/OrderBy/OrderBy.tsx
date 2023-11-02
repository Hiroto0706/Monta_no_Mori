import React from "react";

import "./OrderBy.css";

const OrderBy: React.FC = () => {
  return (
    <>
      <div className="order-by">
        <span>Order by</span>
        <div className="order-by__btn">
          <span className="recent active">Recent</span>
          <span className="popular">Popular</span>
        </div>
      </div>
    </>
  );
};

export default OrderBy;
