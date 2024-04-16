import styles from "../styles/DiscoverBottom.module.css";
import DiscoverBottomLeft from "./DiscoverBottomLeft";
import DiscoverBottomRight from "./DiscoverBottomRight";

function DiscoverBottom() {
  return (
    <div className={styles.bottom}>
      <DiscoverBottomLeft />
      <DiscoverBottomRight />
    </div>
  );
}

export default DiscoverBottom;
