// hooks/useIsFirstRender.js (create this file)
import { useRef, useEffect } from "react";

const useIsFirstRender = () => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []); // Run only once after the initial render

  return isFirstRender.current;
};

export default useIsFirstRender;
