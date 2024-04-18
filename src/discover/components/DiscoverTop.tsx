import { useSelector } from "react-redux";
import IconButton from "../../generic/components/IconButton";
import { AuthMode } from "../../state/slice.auth";
import { StoreState } from "../../state/store";
import styles from "../styles/DiscoverTop.module.css";
import useAction from "../../utility-hooks/useAction";
import { useContext, useEffect, useRef } from "react";
import { TooltipContext } from "../../overlays/components/TooltipProvider";

interface Props {
  onClickSourcePicker: () => void;
  onClickDestinationPicker: () => void;
}

function DiscoverTop({ onClickSourcePicker, onClickDestinationPicker }: Props) {
  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
  );
  const doAction = useAction();

  const registerTooltip = useContext(TooltipContext);

  const sourceRef = useRef(null);
  const destRef = useRef(null);

  useEffect(() => {
    if (sourceRef.current)
      registerTooltip({
        message: "Click 👆 here to choose your recommendations ♫",
        target: sourceRef.current,
      });
  }, [sourceRef.current]);

  useEffect(() => {
    if (destRef.current)
      registerTooltip({
        message: "Click 👆 here to choose where your likes ❤️ save to",
        target: destRef.current,
      });
  }, [destRef.current]);

  return (
    <div className={styles.top}>
      <IconButton
        ref={sourceRef}
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
        ref={destRef}
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
