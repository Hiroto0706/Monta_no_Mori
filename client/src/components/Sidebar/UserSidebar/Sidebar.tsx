import React, { useState } from "react";

import "./Sidebar.css";

interface EllipsisTextProps {
  text: string;
  maxLength: number;
}

export const EllipsisText: React.FC<EllipsisTextProps> = ({
  text,
  maxLength,
}) => {
  const truncatedText =
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  return <span>{truncatedText}</span>;
};

const Sidebar: React.FC = () => {
  const [typeMaxLength] = useState(10);
  const [categoryMaxLength] = useState(10);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__inner__type">
            <h3>Type</h3>
            <a href="" className="type-link">
              <EllipsisText text="テストテススト" maxLength={typeMaxLength} />{" "}
              <div>
                <img src="/public/pc-img.png" />
              </div>
            </a>
            <a href="" className="type-link">
              <EllipsisText text="テストテストテ" maxLength={typeMaxLength} />{" "}
              <div>
                <img src="/public/pc-img.png" />
              </div>
            </a>
            <a href="" className="type-link">
              <EllipsisText text="テスト" maxLength={typeMaxLength} />{" "}
              <div>
                <img src="/public/pc-img.png" />
              </div>
            </a>
            <a href="" className="type-link">
              <EllipsisText text="テストテストテ" maxLength={typeMaxLength} />{" "}
              <div>
                <img src="/public/pc-img.png" />
              </div>
            </a>
          </div>

          <div className="sidebar__inner__category">
            <h3>Category</h3>
            <a href="" className="category-link">
              #
              <EllipsisText
                text="テストテストテストテストテストテストテスト"
                maxLength={categoryMaxLength}
              />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText
                text="テストテストテストテストテストテストテスト"
                maxLength={categoryMaxLength}
              />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText
                text="テストテストテストテストテストテストテスト"
                maxLength={categoryMaxLength}
              />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テスト" maxLength={categoryMaxLength} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テスト" maxLength={categoryMaxLength} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テスト" maxLength={categoryMaxLength} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テスト" maxLength={categoryMaxLength} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText text="テスト" maxLength={categoryMaxLength} />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText
                text="テストテストテストテストテストテストテスト"
                maxLength={categoryMaxLength}
              />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText
                text="テストテストテストテストテストテストテスト"
                maxLength={categoryMaxLength}
              />
            </a>
            <a href="" className="category-link">
              #
              <EllipsisText
                text="テストテストテストテストテストテストテスト"
                maxLength={categoryMaxLength}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
