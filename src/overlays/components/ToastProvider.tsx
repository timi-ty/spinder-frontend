import { ReactNode, createContext, useEffect, useRef } from "react";
import "../styles/ToastOverlay.scss";
import { useSelector } from "react-redux";
import {
  hideTopToast,
  hideBottomToast,
  showTopToast,
  showBottomToast,
} from "../../state/slice.globalui";
import { StoreState, dispatch } from "../../state/store";
import { nullTimeoutHandle } from "../../utils";

interface Props {
  isTopToastShowing: boolean;
  isBottomToastShowing: boolean;
  topToastMessage: string;
  bottomToastMessage: string;
}

function ToastOverlay({
  isTopToastShowing,
  isBottomToastShowing,
  topToastMessage,
  bottomToastMessage,
}: Props) {
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

const ToastContext = createContext(
  (_message: string, _location: "Top" | "Bottom" = "Top") => {}
);

interface ProviderProps {
  children?: ReactNode;
}

function ToastProvider({ children }: ProviderProps) {
  const toastDurationMillis = 2000; //Show toast messages for 2 seconds.

  const isTopToastShowing = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isTopToastVisible
  );
  const isBottomToastShowing = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isBottomToastVisible
  );

  const topToastMessage = useSelector<StoreState, string>(
    (state) => state.globalUIState.topToastMessage
  );
  const bottomToastMessage = useSelector<StoreState, string>(
    (state) => state.globalUIState.bottomToastMessage
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
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastOverlay
        isTopToastShowing={isTopToastShowing}
        isBottomToastShowing={isBottomToastShowing}
        topToastMessage={topToastMessage}
        bottomToastMessage={bottomToastMessage}
      />
    </ToastContext.Provider>
  );
}

export { ToastContext };

export default ToastProvider;
