import SandboxUnauthorizedAction from "../sandbox-components/components/SandboxUnauthorizedAction";
import "./ComponentViewer.scss";

const isViewingComponent = false;

function ComponentViewer() {
  return (
    <div className="component-viewer">
      <SandboxUnauthorizedAction actionDescription={"do this action"} />
    </div>
  );
}

export default ComponentViewer;

export { isViewingComponent };
