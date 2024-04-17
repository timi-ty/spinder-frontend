import { useState, useMemo, useEffect } from "react";

function useAppRect(): DOMRect {
  const appRoot = document.getElementById("root")!;

  const [appRect, setAppRect] = useState(appRoot.getBoundingClientRect());

  const containerSizeObserver = useMemo(
    () =>
      new ResizeObserver(() => {
        setAppRect(appRoot.getBoundingClientRect());
      }),
    []
  );

  useEffect(() => {
    containerSizeObserver.observe(appRoot);
    return () => containerSizeObserver.unobserve(appRoot);
  }, []);

  return appRect;
}

export default useAppRect;
