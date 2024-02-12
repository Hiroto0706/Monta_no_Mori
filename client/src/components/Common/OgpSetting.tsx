import React from "react";
import { Helmet } from "react-helmet";

type Props = {
  title?: string;
  imageUrl?: string;
};

const OgpSetting: React.FC<Props> = ({
  title = "もんたの森｜ゆふわなフリー画像サイト✨",
  imageUrl = "https://storage.googleapis.com/monta_free_image/ogp-image.png",
}) => {
  const DESC_TEMP =
    "もんたの森はかわいくてクセのある画像を提供しているよ！ぜひダウンロードしてね！";
  const DESC_DETAIL_TEMP = `この画像は${title}だよ！ぜひダウンロード・コピーして使ってね！`;

  const description = `${DESC_TEMP}${
    title !== "もんたの森｜ゆふわなフリー画像サイト✨" ? DESC_DETAIL_TEMP : ""
  }`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
    </Helmet>
  );
};

export default OgpSetting;
