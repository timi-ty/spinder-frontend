import { useState } from "react";
import ErrorOneMessageTwoAction from "./generic/components/ErrorOneMessageTwoAction";
import { Navigate } from "react-router-dom";

function ErrorBoundary() {
  const [navigateHome, setNavigateHome] = useState(false);
  return (
    <>
      <ErrorOneMessageTwoAction
        message={"Something went wrong."}
        actionOne={{
          name: "Reload Page",
          action: () => window.location.reload(),
        }}
        actionTwo={{ name: "Go Home", action: () => setNavigateHome(true) }}
      />
      {navigateHome && <Navigate to={"/home"} />}
    </>
  );
}

export default ErrorBoundary;
