import { useContext, useEffect, useRef } from "react";
import { TooltipContext } from "../overlays/components/TooltipProvider";
import styles from "./ComponentViewer.module.css";
import withOverlayProviders from "../overlays/components/withOverlayProviders";

const isViewingComponent = false;

function ComponentViewer() {
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const registerTooltip = useContext(TooltipContext);

  useEffect(() => {
    if (firstRef.current) {
      registerTooltip({
        message: "This is the first tooltip",
        target: firstRef.current,
      });
    }
  }, [firstRef.current]);

  useEffect(() => {
    if (secondRef.current) {
      registerTooltip({
        message: "This is the second tooltip",
        target: secondRef.current,
      });
    }
  }, [secondRef.current]);

  return (
    <div className={styles.componentViewer}>
      <div
        ref={firstRef}
        style={{ translate: "200px 340px", width: "fit-content" }}
      >
        First Tooltip Target
      </div>

      <div
        ref={secondRef}
        style={{ translate: "50px 140px", width: "fit-content" }}
      >
        Second Tooltip Target
      </div>
    </div>
  );
}

export default withOverlayProviders(<ComponentViewer />);

export { isViewingComponent };
