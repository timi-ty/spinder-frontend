import { useSelector } from "react-redux";
import {
  hideBottomToast,
  hideTopToast,
  showBottomToast,
  showTopToast,
} from "../state/slice.toast";
import { StoreState, dispatch } from "../state/store";
import "./ToastOverlay.scss";
import { useEffect, useRef } from "react";
import { nullTimeoutHandle } from "../utils/utils";

const toastDurationMillis = 2000; //Show toast messages for 2 seconds.

function ToastOverlay() {
  const isTopToastShowing = useSelector<StoreState, boolean>(
    (state) => state.toastState.isTopToastVisible
  );
  const isBottomToastShowing = useSelector<StoreState, boolean>(
    (state) => state.toastState.isBottomToastVisible
  );

  const topToastMessage = useSelector<StoreState, string>(
    (state) => state.toastState.topToastMessage
  );
  const bottomToastMessage = useSelector<StoreState, string>(
    (state) => state.toastState.bottomToastMessage
  );

  const topTimeoutHandle = useRef(nullTimeoutHandle);
  const bottomTimeoutHandle = useRef(nullTimeoutHandle);

  useEffect(() => {
    if (topTimeoutHandle.current) clearTimeout(topTimeoutHandle.current);
    if (isTopToastShowing) {
      topTimeoutHandle.current = setTimeout(() => {
        dispatch(hideTopToast());
      }, toastDurationMillis);
    }
  }, [isTopToastShowing]);

  useEffect(() => {
    if (bottomTimeoutHandle.current) clearTimeout(bottomTimeoutHandle.current);
    if (isBottomToastShowing) {
      bottomTimeoutHandle.current = setTimeout(() => {
        dispatch(hideBottomToast());
      }, toastDurationMillis);
    }
  }, [isBottomToastShowing]);

  return (
    <div className="toast-overlay">
      <div
        style={{ opacity: `${isTopToastShowing ? "1" : "0"}` }}
        className="message"
      >
        {topToastMessage}
      </div>
      <div
        style={{ opacity: `${isBottomToastShowing ? "1" : "0"}` }}
        className="message"
      >
        {bottomToastMessage}
      </div>
    </div>
  );
}

function showToast(message: string, location: "Top" | "Bottom" = "Top") {
  switch (location) {
    case "Top":
      dispatch(showTopToast(message));
      break;
    case "Bottom":
      dispatch(showBottomToast(message));
      break;
  }
}

export default ToastOverlay;

export { showToast };
