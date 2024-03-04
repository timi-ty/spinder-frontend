import { useEffect } from "react";
import ToastOverlay, { showToast } from "../toast/ToastOverlay";
import "./ComponentViewer.scss";

const isViewingComponent = true;

function ComponentViewer() {
  useEffect(() => {
    showToast("Time to triangle", "Bottom");
  }, []);
  return (
    <div className="component-viewer">
      <ToastOverlay />
    </div>
  );
}

export default ComponentViewer;

export { isViewingComponent };
