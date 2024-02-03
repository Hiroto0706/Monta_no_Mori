import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import "./Loader.css";

type Props = {
  timeout?: number;
};

const LoaderSpinner: React.FC<Props> = ({ timeout = 5000 }) => {
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div className="loader">
      {!isTimeout ? (
        <div>
          <Oval color="#4caf50" height={50} width={50} />
        </div>
      ) : (
        <p className="text">がぞうはみつかりませんでした！</p>
      )}
    </div>
  );
};

export default LoaderSpinner;
