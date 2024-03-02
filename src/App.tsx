import { Navigate } from "react-router-dom";
import Discover from "./discover/components/Discover";
import FullScreenLoader from "./generic/components/FullScreenLoader";
import { useAuthResource } from "./utils/hooks";
import ErrorLogin from "./errors/components/ErrorLogin";

function App() {
  const authStatus = useAuthResource();
  return (
    <>
      {authStatus === "Loading" && <FullScreenLoader />}
      {authStatus === "LoggedIn" && <Discover />}
      {authStatus === "Error" && <ErrorLogin />}
      {
        /* This will onload the store because it is outside the app root.*/
        authStatus === "LoggedOut" && <Navigate to="/home" />
      }
    </>
  );
}

export default App;
