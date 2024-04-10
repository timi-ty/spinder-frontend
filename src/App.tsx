import { Navigate } from "react-router-dom";
import Discover from "./discover/components/Discover";
import ErrorOneMessageTwoAction from "./generic/components/ErrorOneMessageTwoAction";
import FullComponentLoader from "./generic/components/FullComponentLoader";
import { logout } from "./client/client";
import { useContext, useEffect } from "react";
import SandboxSignIn from "./sandbox-components/components/SandboxSignIn";
import { PopupContext } from "./overlays/components/PopupProvider";
import useAuthResource from "./resource-hooks/useAuthResource";
import { useSelector } from "react-redux";
import { StoreState } from "./state/store";
import SandboxUnauthorizedAction from "./sandbox-components/components/SandboxUnauthorizedAction";

function App() {
  const { authStatus, authMode } = useAuthResource();
  const { pushPopup, clearPopup } = useContext(PopupContext);
  const isAttemptingUnauthAction = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isAttemptingUnauthorizedAction
  );
  const unauthActionDescription = useSelector<StoreState, string>(
    (state) => state.globalUIState.lastAttemptedUnauthorizedAction
  );

  useEffect(() => {
    if (authMode === "UnacceptedAnon") {
      console.log("Pushing uanon popup");
      pushPopup("AuthMode", <SandboxSignIn />);
    } else {
      clearPopup("AuthMode");
    }
    return () => clearPopup("AuthMode");
  }, [authMode]);

  useEffect(() => {
    if (isAttemptingUnauthAction) {
      pushPopup(
        "UnauthAction",
        <SandboxUnauthorizedAction
          actionDescription={unauthActionDescription}
        />
      );
    } else {
      clearPopup("UnauthAction");
    }
    return () => clearPopup("UnauthAction");
  }, [isAttemptingUnauthAction, unauthActionDescription]);

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
