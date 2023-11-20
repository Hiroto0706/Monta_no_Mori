import React from "react";

import "./Search.css";

const Search: React.FC = () => {
  return (
    <>
      <form className="search">
        <button className="type-list">
          button
          <img src="/search-arrow-icon.png" />
        </button>
        <input placeholder="Search illustration..." />
        <button className="search-button">
          <img src="/search-icon.png" />
        </button>
      </form>
    </>
  );
};

export default Search;
