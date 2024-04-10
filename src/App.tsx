import { Navigate } from "react-router-dom";
import Discover from "./discover/components/Discover";
import { useAuthResource, usePopup, useToast } from "./utils/hooks";
import ErrorOneMessageTwoAction from "./generic/components/ErrorOneMessageTwoAction";
import FullComponentLoader from "./generic/components/FullComponentLoader";
import { ToastContext } from "./utils/context";
import { logout } from "./client/client";
import { useCallback, useEffect, useState } from "react";
import { isFullScreen as getIsFullScreen } from "./client/client";
import { useDispatch } from "react-redux";
import SandboxVerifyAuth from "./sandbox-components/components/SandboxVerifyAuth";

function App() {
  const { authStatus, authMode } = useAuthResource();
  const { hydratedToastOverlay: ToastOverlay, showToast } = useToast();
  const {
    hydratedPopupOverlay: PopupOverlay,
    pushPopup,
    clearPopup,
  } = usePopup();

  useEffect(() => {
    if (authMode === "UnacceptedAnon") {
      pushPopup("AuthMode", <SandboxVerifyAuth />);
    } else {
      clearPopup("AuthMode");
    }

    return () => clearPopup("AuthMode");
  }, [authMode]);

  const [isFullScreen, setIsFullScreen] = useState(getIsFullScreen());
  const dispatch = useDispatch();

  const onFullScreenChange = useCallback(() => {
    setIsFullScreen(getIsFullScreen());
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, []);

  return (
    <>
      {authStatus === "Loading" && <FullComponentLoader />}
      <ToastContext.Provider value={showToast}>
        {authStatus === "LoggedIn" && <Discover />}
      </ToastContext.Provider>
      {authStatus === "Error" && (
        <ErrorOneMessageTwoAction
          message={
            "There was an error with login. If this error persists, logout and then login with Spotify again."
          }
          actionOne={{ name: "Retry", action: () => window.location.reload() }}
          actionTwo={{ name: "Logout", action: () => logout() }}
        />
      )}
      {authStatus === "LoggedOut" && <Navigate to="/home" />}
      <ToastOverlay />
      <PopupOverlay />
      {/* Remove fullscreen overlay */}
      {/* {useFullscreenDevice() && !isFullScreen && <RequestFullScreenOverlay />} */}
    </>
  );
}

export default App;
