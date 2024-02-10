import React, { Fragment, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Image from "./Image";
import { UserImage } from "../../../pages/Content/Home/Home";
import LoaderSpinner from "../../Common/Loader";

type Props = {
  loadMore: (page: number) => void;
  hasMore: boolean;
  images: UserImage[];
};

const InfinityImageList: React.FC<Props> = ({ loadMore, hasMore, images }) => {
  const [favoriteIDs, setFavoriteIDs] = useState<string[]>([]);

  // 引数のIDをもとにローカルホストとReact上のIDsを更新する
  const toggleFavorite = (
    imageId: string,
    favoriteIDs: string[],
    setFavoriteIDs: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    let updatedFavorites;
    if (favoriteIDs.includes(imageId)) {
      updatedFavorites = favoriteIDs.filter((id) => id !== imageId);
    } else {
      updatedFavorites = [...favoriteIDs, imageId];
    }
    setFavoriteIDs(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavoriteIDs(storedFavorites);
  }, []);

  return (
    <>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        loader={<LoaderSpinner key={0} />}
      >
        <ul className="home__image-list">
          {images.map((image, index) => (
            <Fragment key={index}>
              <Image
                key={image.id}
                id={image.id}
                title={image.title}
                src={image.src}
                type_id={image.type_id}
                type={image.type}
                toggleFavorite={() =>
                  toggleFavorite(
                    image.id.toString(),
                    favoriteIDs,
                    setFavoriteIDs
                  )
                }
              />
            </Fragment>
          ))}
        </ul>
      </InfiniteScroll>
    </>
  );
};

export default InfinityImageList;
