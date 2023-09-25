import { useState, useLayoutEffect } from "react";

const useViewport = () => {
  const [size, setSize] = useState([0, 0]);
  function updateSize() {
    setSize([window.innerWidth, window.innerHeight]);
  }

  useLayoutEffect(() => {
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export default useViewport;
