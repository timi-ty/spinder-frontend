import { useSelector } from "react-redux";
import IconButton from "../../generic/components/IconButton";
import { AuthMode } from "../../state/slice.auth";
import { StoreState } from "../../state/store";
import styles from "../styles/DiscoverTop.module.css";
import useAction from "../../utility-hooks/useAction";

interface Props {
  onClickSourcePicker: () => void;
  onClickDestinationPicker: () => void;
}

function DiscoverTop({ onClickSourcePicker, onClickDestinationPicker }: Props) {
  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
  );
  const doAction = useAction();

  return (
    <div className={styles.top}>
      <IconButton
        icon={"/resources/ic_discover_source.svg"}
        onAction={() =>
          doAction(onClickSourcePicker, {
            requiresFullAuth: false,
            actionDescription: "explore recommendation sources",
          })
        }
        title={"Source"}
        showBackground={false}
      />
      <IconButton
        icon={"/resources/ic_discover_dest.svg"}
        onAction={() =>
          doAction(onClickDestinationPicker, {
            requiresFullAuth: true,
            actionDescription: "manage where liked songs get saved",
          })
        }
        title={"Destination"}
        showBackground={false}
        className={authMode === "Full" ? "" : "unauth-action"}
      />
    </div>
  );
}

export default DiscoverTop;
