import { Navigate } from "react-router-dom";
import Discover from "./discover/components/Discover";
import FullScreenLoader from "./loaders/components/FullScreenLoader";
import { useAuthResource } from "./utils/hooks";
import { Provider } from "react-redux";
import { store } from "./state/store";

function App() {
  const authStatus = useAuthResource();
  return (
    <Provider store={store}>
      {authStatus === "Loading" && <FullScreenLoader />}
      {authStatus === "LoggedIn" && <Discover />}
      {
        /* This will onload the store because it is outside the app root.*/
        authStatus !== "Loading" && authStatus !== "LoggedIn" && (
          <Navigate to="/home" />
        )
      }
    </Provider>
  );
}

export default App;
