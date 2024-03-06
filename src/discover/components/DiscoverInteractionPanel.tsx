import { LegacyRef, forwardRef } from "react";
import "../styles/DiscoverInteractionPanel.scss";

const DiscoverInteractionPanel = forwardRef(function DiscoverInteractionPanel(
  _props,
  ref: LegacyRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className="interaction-panel"
      onClick={() => {
        console.log("Clicked Discover Panel.");
      }}
    ></div>
  );
});

export default DiscoverInteractionPanel;
