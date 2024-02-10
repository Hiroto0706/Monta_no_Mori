import React, { useState, useEffect } from "react";
import axios from "axios";

import SearchForm from "../../../components/Form/Search/SearchForm";
// import OrderBy from "../../../components/Form/OrderBy/OrderBy";
import LoaderSpinner from "../../../components/Common/Loader";

import "./Home.css";
import InfinityImageList from "../../../components/Image/UserImage/InfinityImageList";

export interface UserType {
  id: number;
  name: string;
  src: string;
}

export interface UserImage {
  id: number;
  title: string;
  src: string;
  type_id: number;
  type: UserType;
}

export interface responsePayload {
  image: UserImage;
  type: UserType;
}

const Home: React.FC = () => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [page, setPage] = useState(0);
  const [hasMoreImages, setHasMoreImages] = useState(true);

  const fetchUsersImages = (p: number) => {
    axios
      .get(import.meta.env.VITE_BASE_API + `?p=${p}`)
      .then((response) => {
        const responsePayload = response.data.payload;
        const transformedImages = responsePayload.map(TransformPayloadToImage);
        setImages([...images, ...transformedImages]);
        if (transformedImages.length < import.meta.env.VITE_IMAGE_FETCH_LIMIT) {
          setHasMoreImages(false);
          return;
        }
        setPage(p + 1);
      })
      .catch((error) => {
        console.error("List images failed : ", error);
      });
  };

  useEffect(() => {
    fetchUsersImages(0);
  }, []);

  return (
    <>
      <div className="home">
        {/* <OrderBy /> */}
        <SearchForm />
        <h2>がぞういちらん</h2>
        {images.length > 0 ? (
          <>
            <InfinityImageList
              loadMore={() => fetchUsersImages(page)}
              hasMore={hasMoreImages}
              images={images}
            />
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </>
  );
};

export default Home;

export const TransformPayloadToImage = (payload: responsePayload) => {
  return {
    id: payload.image.id,
    src: payload.image.src,
    title: payload.image.title,
    type_id: payload.image.type_id,
    type: payload.type,
  };
};
