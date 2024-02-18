import { Navigate } from "react-router-dom";
import Discover from "../discover/Discover";
import FullScreenLoader from "../loaders/FullScreenLoader";
import { useAuthResource } from "../utils/hooks";

function App() {
  const authStatus = useAuthResource();
  return (
    <>
      {authStatus === "Loading" && <FullScreenLoader />}
      {authStatus === "LoggedIn" && <Discover />}
      {
        /* This will onload the store because it is outside the app root.*/
        authStatus === "LoggedOut" && <Navigate to="/home" />
      }
    </>
  );
}

export default App;
