import React from "react";

import "./Sidebar.css";

interface EllipsisTextProps {
  text: string;
}

export const EllipsisText: React.FC<EllipsisTextProps> = ({ text }) => {
  const truncatedText = text.length > 10 ? text.substring(0, 10) + "..." : text;
  return <span>{truncatedText}</span>;
};

const Sidebar: React.FC = () => {
  return (
    <>
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__inner__type">
            <h3>Type</h3>
            <a href="">
              <EllipsisText text="テストテストテストテストテストテストテスト" />
              <div>
                <img src="public/pc-img.png" />
              </div>
            </a>
            <a href="">
              <EllipsisText text="テストテストテストテストテストテストテスト" />{" "}
              <div>
                <img src="public/pc-img.png" />
              </div>
            </a>
            <a href="">
              <EllipsisText text="テスト" />{" "}
              <div>
                <img src="public/pc-img.png" />
              </div>
            </a>
            <a href="">
              <EllipsisText text="テスト" />{" "}
              <div>
                <img src="public/pc-img.png" />
              </div>
            </a>
          </div>

          <div className="sidebar__inner__category">
            <h3>Category</h3>
            <a href="">
              #
              <EllipsisText text="テストテストテストテストテストテストテスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストテストテストテストテストテスト" />
            </a>
            <a href="">
              #<EllipsisText text="テスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストテストテストテストテストテスト" />
            </a>
            <a href="">
              #<EllipsisText text="テスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストテストテストテストテストテスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストテスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストストテストテスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストストテストテスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストストテストテスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストストテストテスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストストテストテスト" />
            </a>
            <a href="">
              #
              <EllipsisText text="テストテストストテストテスト" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
