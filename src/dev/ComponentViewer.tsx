import { useContext, useEffect, useRef } from "react";
import { TooltipContext } from "../overlays/components/TooltipProvider";
import "./ComponentViewer.scss";
import withOverlayProviders from "../overlays/components/withOverlayProviders";

const isViewingComponent = true;

function ComponentViewer() {
  const ref = useRef(null);
  const registerTooltip = useContext(TooltipContext);

  useEffect(() => {
    if (ref.current) {
      registerTooltip({ message: "This is a tooltip", target: ref.current });
    }
  }, [ref.current]);

  return (
    <div className="component-viewer">
      <div ref={ref}>Tooltip Target</div>
    </div>
  );
}

export default withOverlayProviders(<ComponentViewer />);

export { isViewingComponent };
