import { Navigate } from "react-router-dom";
import Discover from "./discover/components/Discover";
import FullScreenLoader from "./loaders/components/FullScreenLoader";
import { useAuthResource } from "./utils/hooks";

function App() {
  const authStatus = useAuthResource();
  return (
    <>
      {authStatus === "Loading" && <FullScreenLoader />}
      {authStatus === "LoggedIn" && <Discover />}
      {
        /* This will onload the store because it is outside the app root.*/
        (authStatus === "Error" || authStatus === "LoggedOut") && (
          <Navigate to="/home" />
        )
      }
    </>
  );
}

export default App;
