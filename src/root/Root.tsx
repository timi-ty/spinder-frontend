import { Provider } from "react-redux";
import { store } from "../state/store";
import App from "./App";
import ComponentViewer, { isViewingComponent } from "../dev/ComponentViewer";

function Root() {
  return (
    <Provider store={store}>
      <App />
      {isViewingComponent && <ComponentViewer></ComponentViewer>}
    </Provider>
  );
}

export default Root;
