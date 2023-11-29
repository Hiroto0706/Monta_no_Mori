import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchUsersImages } from "../../../pages/Content/Home/Home";

import "./Search.css";

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const dispatch = useDispatch();

  const changeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const searchImages = async (searchText: string) => {
    try {
      const response = await axios.get("http://localhost:8080/search", {
        params: {
          q: searchText,
        },
      });
      console.log(response.data); // 検索結果を処理
      fetchUsersImages(dispatch, response.data.result);
    } catch (error) {
      console.error("Error during image search", error);
    }
  };

  return (
    <>
      <form
        className="search"
        onSubmit={(e) => {
          searchImages(searchText);
          e.preventDefault();
        }}
      >
        <input
          placeholder="いらすとをけんさく"
          value={searchText}
          onChange={(e) => changeSearchText(e)}
        />
        <button className="search-button" type="submit">
          <img src="/search-icon.png" />
        </button>
      </form>
    </>
  );
};

export default Search;
