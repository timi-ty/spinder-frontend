import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import "../styles/ToastOverlay.scss";
import { nullTimeoutHandle } from "../../utils";
import useWindowSize from "../../utility-hooks/useWindowSize";

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
  const [, windowHeight] = useWindowSize();

  return (
    <div className="toast-overlay" style={{ maxHeight: `${windowHeight}px` }}>
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

  const [isTopToastShowing, setIsTopToastShowing] = useState(false);
  const [isBottomToastShowing, setIsBottomToastShowing] = useState(false);

  const [topToastMessage, setTopToastMessage] = useState("");
  const [bottomToastMessage, setBottomToastMessage] = useState("");

  const topTimeoutHandle = useRef(nullTimeoutHandle);
  const bottomTimeoutHandle = useRef(nullTimeoutHandle);

  useEffect(() => {
    if (topTimeoutHandle.current) clearTimeout(topTimeoutHandle.current);
    if (isTopToastShowing) {
      topTimeoutHandle.current = setTimeout(() => {
        setIsTopToastShowing(false);
      }, toastDurationMillis);
    }
  }, [isTopToastShowing]);

  useEffect(() => {
    if (bottomTimeoutHandle.current) clearTimeout(bottomTimeoutHandle.current);
    if (isBottomToastShowing) {
      bottomTimeoutHandle.current = setTimeout(() => {
        setIsBottomToastShowing(false);
      }, toastDurationMillis);
    }
  }, [isBottomToastShowing]);

  function showToast(message: string, location: "Top" | "Bottom" = "Top") {
    switch (location) {
      case "Top":
        setIsTopToastShowing(true);
        setTopToastMessage(message);
        break;
      case "Bottom":
        setIsBottomToastShowing(true);
        setBottomToastMessage(message);
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
