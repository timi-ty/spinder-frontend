import { useCallback, useEffect } from "react";
import "../styles/RequestFullScreenOverlay.scss";

function swithToFullScreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }
}

function RequestFullScreenOverlay() {
  //Block all window level listeners (the app should not be interactive while waiting for full screen mode). This works because we assume this component is always mounted before other interactive components.
  const blockAllMouse = useCallback((ev: MouseEvent) => {
    ev.stopImmediatePropagation();
  }, []);
  const blockAllTouch = useCallback((ev: TouchEvent) => {
    ev.stopImmediatePropagation();
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", blockAllMouse);
    window.addEventListener("mouseup", blockAllMouse);
    window.addEventListener("mousemove", blockAllMouse);

    return () => {
      window.removeEventListener("mousedown", blockAllMouse);
      window.removeEventListener("mouseup", blockAllMouse);
      window.removeEventListener("mousemove", blockAllMouse);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("touchstart", blockAllTouch);
    window.addEventListener("touchmove", blockAllTouch);
    window.addEventListener("touchend", blockAllTouch);

    return () => {
      window.removeEventListener("touchstart", blockAllTouch);
      window.removeEventListener("touchmove", blockAllTouch);
      window.removeEventListener("touchend", blockAllTouch);
    };
  }, []);

  return (
    <div className="request-full-screen" onClick={swithToFullScreen}>
      <div className="message">
        Tap anywhere to enter full screen and use Spinder!
      </div>
    </div>
  );
}

export default RequestFullScreenOverlay;
