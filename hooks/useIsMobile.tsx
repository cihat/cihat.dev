import { mobileWidth } from "@/store/types";
import { useLayoutEffect, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= mobileWidth);
  };

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
