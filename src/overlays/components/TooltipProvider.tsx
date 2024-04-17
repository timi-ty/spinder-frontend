import { ReactNode, createContext, useEffect, useState } from "react";
import styles from "../styles/TooltipOverlay.module.css";
import useWindowSize from "../../utility-hooks/useWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { setIsTooltipShowing } from "../../state/slice.globalui";
import { StoreState } from "../../state/store";

interface Tooltip {
  message: string;
  target: HTMLElement;
}

interface Props {
  tooltip: Tooltip;
  onOverlayClick: () => void;
}

function TooltipOverlay({ tooltip, onOverlayClick }: Props) {
  const [, windowHeight] = useWindowSize();

  return (
    <div
      className={styles.tooltipOverlay}
      style={{ maxHeight: `${windowHeight}px` }}
    >
      <div className={styles.message}>{tooltip.message}</div>
    </div>
  );
}

const TooltipContext = createContext((_tooltip: Tooltip) => {});

interface ProviderProps {
  children?: ReactNode;
}

function TooltipProvider({ children }: ProviderProps) {
  const dispatch = useDispatch();
  const isTooltipShowing = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isTooltipShowing
  );
  const [tooltips, setTooltips] = useState(() => {
    const emptyTooltips: Tooltip[] = [];
    return emptyTooltips;
  });
  const [currentTooltip, setCurrentTooltip] = useState(tooltips[0]);

  function registerTooltip(tooltip: Tooltip) {
    setTooltips((oldTooltips) => [...oldTooltips, tooltip]);
  }

  function clearTooltip(tooltip: Tooltip) {
    setTooltips((oldTooltips) =>
      oldTooltips.filter((oldTooltip) => oldTooltip.target !== tooltip.target)
    );
  }

  useEffect(() => {
    if (tooltips.length > 0) {
      dispatch(setIsTooltipShowing(true));
      setCurrentTooltip(tooltips[0]);
    } else {
      dispatch(setIsTooltipShowing(false));
    }
  }, [tooltips]);

  return (
    <TooltipContext.Provider value={registerTooltip}>
      {children}
      {isTooltipShowing && currentTooltip && (
        <TooltipOverlay
          tooltip={currentTooltip}
          onOverlayClick={() => clearTooltip(currentTooltip)}
        />
      )}
    </TooltipContext.Provider>
  );
}

export { TooltipContext };

export default TooltipProvider;
