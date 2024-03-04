import "../styles/DiscoverBottom.scss";
import DiscoverBottomLeft from "./DiscoverBottomLeft";
import DiscoverBottomRight from "./DiscoverBottomRight";

function DiscoverBottom() {
  return (
    <div className="bottom">
      <DiscoverBottomLeft />
      <DiscoverBottomRight />
    </div>
  );
}

export default DiscoverBottom;
