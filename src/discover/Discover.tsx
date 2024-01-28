import { Navigate } from "react-router-dom";
import { useLoginState, LOGIN_STATE } from "../hooks/hooks";
import DiscoverContent from "./DiscoverContent";
import FullScreenLoader from "../loaders/FullScreenLoader";

function Discover() {
  const loginState = useLoginState();
  return (
    <>
      {loginState === LOGIN_STATE.PENDING && <FullScreenLoader />}
      {loginState === LOGIN_STATE.LOGGED_IN && <DiscoverContent />}
      {loginState === LOGIN_STATE.LOGGED_OUT && <Navigate to="/home" />}
    </>
  );
}

export default Discover;
