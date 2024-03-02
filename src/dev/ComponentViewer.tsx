import ErrorLogin from "../errors/components/ErrorLogin";
import "./ComponentViewer.scss";

const isViewingComponent = false;

function ComponentViewer() {
  return (
    <div className="component-viewer">
      <ErrorLogin />
    </div>
  );
}

export default ComponentViewer;

export { isViewingComponent };
