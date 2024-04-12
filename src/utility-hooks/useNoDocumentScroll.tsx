import { useCallback, useEffect } from "react";

function useNoDocumentScroll(condition: boolean) {
  const root = document.getElementById("root")!;

  const preventScrollIfCondition = useCallback(
    (event: TouchEvent) => {
      if (condition) event.preventDefault();
    },
    [condition]
  );

  useEffect(() => {
    window.scrollY = 0;
    document.body.addEventListener("touchmove", preventScrollIfCondition, {
      passive: false,
    });
    root.style.overflow = "hidden";
    return () => {
      document.body.removeEventListener("touchmove", preventScrollIfCondition);
      root.style.overflow = "";
    };
  }, [condition]);
}

export default useNoDocumentScroll;
