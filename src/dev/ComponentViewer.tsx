import { useContext, useEffect, useRef } from "react";
import { TooltipContext } from "../overlays/components/TooltipProvider";
import styles from "./ComponentViewer.module.css";
import withOverlayProviders from "../overlays/components/withOverlayProviders";

const isViewingComponent = true;

function ComponentViewer() {
  const ref = useRef(null);
  const registerTooltip = useContext(TooltipContext);

  useEffect(() => {
    if (ref.current) {
      registerTooltip({
        message:
          "This is a skjdbf sdkjbfjsk sdkjdbf jk;ksdbfkj sjdbflkj lksjdbfkjb nsdkjfbn lkjbdffg;jkb dlkjfgbf:DJN tooltip",
        target: ref.current,
      });
    }
  }, [ref.current]);

  return (
    <div className={styles.componentViewer}>
      <div ref={ref} style={{ translate: "200px 340px", width: "fit-content" }}>
        Tooltip Target
      </div>
    </div>
  );
}

export default withOverlayProviders(<ComponentViewer />);

export { isViewingComponent };
