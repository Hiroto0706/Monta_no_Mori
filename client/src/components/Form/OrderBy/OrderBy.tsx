import React, { useState } from "react";

import "./OrderBy.css";

const OrderBy: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"recent" | "popular">(
    "recent"
  );

  const getTabClass = (tab: "recent" | "popular") => {
    return selectedTab === tab ? "active" : "";
  };

  return (
    <>
      <div className="order-by">
        <span>Order by</span>
        <div className="order-by__btn">
          <div
            className={`recent ${getTabClass("recent")}`}
            onClick={() => setSelectedTab("recent")}
          >
            Recent
          </div>
          <div
            className={`popular ${getTabClass("popular")}`}
            onClick={() => setSelectedTab("popular")}
          >
            Popular
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderBy;
