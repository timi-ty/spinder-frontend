import { Navigate } from "react-router-dom";
import Discover from "./discover/components/Discover";
import { useAuthResource } from "./utils/hooks";
import ErrorOneMessageTwoAction from "./generic/components/ErrorOneMessageTwoAction";
import FullComponentLoader from "./generic/components/FullComponentLoader";
import { logout } from "./client/client";
import { useContext, useEffect } from "react";
import SandboxVerifyAuth from "./sandbox-components/components/SandboxSignIn";
import { PopupContext } from "./overlays/components/PopupProvider";

function App() {
  const { authStatus, authMode } = useAuthResource();
  const { pushPopup, clearPopup } = useContext(PopupContext);

  useEffect(() => {
    if (authMode === "UnacceptedAnon") {
      pushPopup("AuthMode", <SandboxVerifyAuth />);
    } else {
      clearPopup("AuthMode");
    }

    return () => clearPopup("AuthMode");
  }, [authMode]);

  return (
    <>
      {authStatus === "Loading" && <FullComponentLoader />}
      {authStatus === "LoggedIn" && <Discover />}
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
    </>
  );
}

export default App;
