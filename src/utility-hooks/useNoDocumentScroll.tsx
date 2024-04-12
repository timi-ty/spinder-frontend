import { useCallback, useEffect } from "react";

function useNoDocumentScroll(condition: boolean) {
  const root = document.getElementById("root")!;

  const preventScrollIfCondition = useCallback(
    (event: TouchEvent) => {
      if (condition) {
        window.scrollY = 0;
        event.preventDefault();
      }
    },
    [condition]
  );

  useEffect(() => {
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
