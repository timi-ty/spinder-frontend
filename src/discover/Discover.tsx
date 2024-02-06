import { Navigate } from "react-router-dom";
import DiscoverContent from "./DiscoverContent";
import FullScreenLoader from "../loaders/FullScreenLoader";
import { useAuthenticationState } from "../utils/hooks";
import { AuthContext } from "../utils/context";
import { defaultAuthState } from "../utils/models";

function Discover() {
  const authState = useAuthenticationState(defaultAuthState);
  return (
    <AuthContext.Provider value={authState}>
      {authState.state === "Pending" && <FullScreenLoader />}
      {authState.state === "LoggedIn" && <DiscoverContent />}
      {authState.state === "LoggedOut" && <Navigate to="/home" />}
    </AuthContext.Provider>
  );
}

export default Discover;
