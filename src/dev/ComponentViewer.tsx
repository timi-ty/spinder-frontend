import React from "react";
import SandboxVerifyAuth from "../sandbox-components/components/SandboxSignIn";
import "./ComponentViewer.scss";

const isViewingComponent = false;

function ComponentViewer() {
  return (
    <div className="component-viewer">
      <SandboxVerifyAuth />
    </div>
  );
}

export default ComponentViewer;

export { isViewingComponent };
