import { useEffect } from "react";
import "../styles/RequestFullScreenOverlay.scss";
import { useDispatch } from "react-redux";
import { setIsAwaitingFullScreen } from "../../state/slice.globalui";
import { swithToFullScreen } from "../../client/client";

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
        Tap anywhere to enter full screen and use Spindr!
      </div>
    </div>
  );
}

export default RequestFullScreenOverlay;
