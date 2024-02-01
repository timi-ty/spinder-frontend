import { Navigate } from "react-router-dom";
import DiscoverContent from "./DiscoverContent";
import FullScreenLoader from "../loaders/FullScreenLoader";
import { useAuthenticationState } from "../utils/hooks";
import { AuthContext } from "../utils/context";

function Discover() {
  const authState = useAuthenticationState({ state: "Pending", token: "" });
  return (
    <AuthContext.Provider value={authState.token}>
      {authState.state === "Pending" && <FullScreenLoader />}
      {authState.state === "LoggedIn" && <DiscoverContent />}
      {authState.state === "LoggedOut" && <Navigate to="/home" />}
    </AuthContext.Provider>
  );
}

export default Discover;
