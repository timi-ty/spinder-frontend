import { Navigate } from "react-router-dom";
import Discover from "../discover/Discover";
import FullScreenLoader from "../loaders/FullScreenLoader";
import { useAuthenticationState } from "../utils/hooks";
import { AuthContext } from "../utils/context";
import { defaultAuthState } from "../utils/models";

function Root() {
  const authState = useAuthenticationState(defaultAuthState);
  return (
    <AuthContext.Provider value={authState}>
      {authState.state === "Pending" && <FullScreenLoader />}
      {authState.state === "LoggedIn" && <Discover />}
      {authState.state === "LoggedOut" && <Navigate to="/home" />}
    </AuthContext.Provider>
  );
}

export default Root;
