import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./home/components/Home";
import "./main.scss";
import App from "./App";
import ComponentViewer, { isViewingComponent } from "./dev/ComponentViewer";
import { Provider } from "react-redux";
import { store } from "./state/store";
import ErrorBoundary from "./ErrorBoundary";
import PendingAccess from "./home/components/PendingAccess";

//TODO: Create error page to handle error boundary.
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />, //The single page Web App is rendered under the root page of the frontend.
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/home",
    element: <Home />, //Renders only if the user is not logged in or if the user goes to the home URL directly.
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/home/pending_access",
    element: <PendingAccess />, //Renders only if the user was redirected after requesting access.
    errorElement: <ErrorBoundary />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={browserRouter}></RouterProvider>
      {import.meta.env.DEV && isViewingComponent && (
        <ComponentViewer></ComponentViewer>
      )}
    </Provider>
  </React.StrictMode>
);
