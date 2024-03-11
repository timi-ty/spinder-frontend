import { useEffect } from "react";
import "../styles/RequestFullScreenOverlay.scss";
import { useDispatch } from "react-redux";
import { setIsAwaitingFullScreen } from "../../state/slice.globalui";

function swithToFullScreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }
}

function RequestFullScreenOverlay() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsAwaitingFullScreen(true));
    return () => {
      dispatch(setIsAwaitingFullScreen(false));
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
