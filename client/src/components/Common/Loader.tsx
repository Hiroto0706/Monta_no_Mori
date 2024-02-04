import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import "./Loader.css";

type Props = {
  height?: number;
  width?: number;
  timeout?: number;
  hasHeight?: boolean;
  message?: string;
};

const LoaderSpinner: React.FC<Props> = ({
  timeout = 100000,
  height = 50,
  width = 50,
  hasHeight = false,
  message = "がぞうはみつかりませんでした！",
}) => {
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div className={`loader ${hasHeight ? "in-image" : ""}`}>
      {!isTimeout ? (
        <div>
          <Oval color="#4caf50" height={height} width={width} />
        </div>
      ) : (
        <p className="text">{message}</p>
      )}
    </div>
  );
};

export default LoaderSpinner;
