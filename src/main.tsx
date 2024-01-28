import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./home/Home";
import Discover from "./discover/Discover";

//TODO: Create error page to handle error boundary.
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Discover />, //Discover is the root page of the frontend.
  },
  {
    path: "/home",
    element: <Home />, //Renders only if the user is not logged in or if the user goes to the home URL directly.
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={browserRouter}></RouterProvider>
  </React.StrictMode>
);
