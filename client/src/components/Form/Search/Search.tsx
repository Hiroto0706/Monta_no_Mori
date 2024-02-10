import React, { useState, useEffect } from "react";
import { Dispatch } from "redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SearchUserImages } from "../../../pages/Content/Home/SearchHome";
import { useLocation, useSearchParams } from "react-router-dom";
import { setSearchQueryParameter } from "../../../slice";

import axios from "axios";

import "./Search.css";

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const changeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    SearchImages(searchText, dispatch);
    navigate(`/search?q=${encodeURIComponent(searchText)}`);
    e.preventDefault();
  };

  useEffect(() => {
    if (location.pathname === "/search") {
      const query = searchParams.get("q");
      dispatch(setSearchQueryParameter(query));

      if (query != null) setSearchText(query);
    }
  }, [location, searchParams, dispatch]);

  return (
    <>
      <form className="search" onSubmit={handleSearchSubmit}>
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

export const SearchImages = async (
  searchText: string,
  dispatch: Dispatch,
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setIsLoading) setIsLoading(true);
  try {
    const response = await axios.get(import.meta.env.VITE_BASE_API + "search", {
      params: {
        q: searchText,
      },
    });
    SearchUserImages(dispatch, response.data.result);
  } catch (error) {
    console.error("Error during image search", error);
  }
  if (setIsLoading) setIsLoading(false);
};
