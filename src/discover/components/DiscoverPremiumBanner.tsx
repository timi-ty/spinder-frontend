import { useSelector } from "react-redux";
import { AuthMode } from "../../state/slice.auth";
import { StoreState } from "../../state/store";
import styles from "../styles/DiscoverPremiumBanner.module.css";

function DiscoverPremiumBanner() {
  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
  );
  const userProduct = useSelector<StoreState, string>(
    (state) => state.userProfileState.data.product
  );

  // Only show for logged-in users without Premium
  // Anonymous users use the owner's Premium account
  const shouldShow =
    authMode === "Full" && userProduct !== "" && userProduct !== "premium";

  if (!shouldShow) return null;

  return (
    <div className={styles.banner}>
      <span className={styles.icon}>🔇</span>
      <span className={styles.text}>
        Audio requires Spotify Premium
      </span>
    </div>
  );
}

export default DiscoverPremiumBanner;

