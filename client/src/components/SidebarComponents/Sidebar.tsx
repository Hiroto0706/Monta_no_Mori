import * as React from "react";

import "./Sidebar.css";

export default function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__inner__type">
            <h3>Type</h3>
            <span>テスト</span>
            <span>テスト</span>
          </div>

          <div className="sidebar__inner__category">
            <h3>Category</h3>
            <span>テスト</span>
            <span>テスト</span>
            <span>テスト</span>
            <span>テスト</span>
            <span>テスト</span>
            <span>テスト</span>
          </div>
        </div>
      </div>
    </>
  );
}
