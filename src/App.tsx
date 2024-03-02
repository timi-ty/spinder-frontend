import { Navigate } from "react-router-dom";
import Discover from "./discover/components/Discover";
import { useAuthResource } from "./utils/hooks";
import ErrorOneMessageTwoAction from "./generic/components/ErrorOneMessageTwoAction";
import { useDispatch } from "react-redux";
import { logoutAuthResource } from "./state/slice.auth";
import FullComponentLoader from "./generic/components/FullComponentLoader";

function App() {
  const authStatus = useAuthResource();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutAuthResource());
  };

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
