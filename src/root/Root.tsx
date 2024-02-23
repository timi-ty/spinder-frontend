import { Provider } from "react-redux";
import { store } from "../state/store";
import App from "./App";
import ComponentViewer, { isViewingComponent } from "../dev/ComponentViewer";

function Root() {
  return (
    <Provider store={store}>
      {isViewingComponent && <ComponentViewer></ComponentViewer>}
      {!isViewingComponent && <App />}
    </Provider>
  );
}

export default Root;
