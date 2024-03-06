import { LegacyRef, forwardRef } from "react";
import "../styles/DiscoverInteractionPanel.scss";

const DiscoverInteractionPanel = forwardRef(function DiscoverInteractionPanel(
  _props,
  ref: LegacyRef<HTMLDivElement>
) {
  return <div ref={ref} className="interaction-panel"></div>;
});

export default DiscoverInteractionPanel;
