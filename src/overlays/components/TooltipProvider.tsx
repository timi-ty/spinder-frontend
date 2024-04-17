import {
  LegacyRef,
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "../styles/TooltipOverlay.module.css";
import useWindowSize from "../../utility-hooks/useWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { setIsTooltipShowing } from "../../state/slice.globalui";
import { StoreState } from "../../state/store";
import useAppRect from "../../utility-hooks/useAppRect";

interface Tooltip {
  message: string;
  target: HTMLElement;
}

interface Props {
  tooltip: Tooltip;
  onOverlayClick: () => void;
}

function TooltipOverlay({ tooltip, onOverlayClick }: Props) {
  const tooltipRef: LegacyRef<HTMLDivElement> = useRef(null);
  const [windowWidth, windowHeight] = useWindowSize();
  const appRect = useAppRect();
  const [position, setPosition] = useState({
    x: tooltip.target.getBoundingClientRect().x,
    y: tooltip.target.getBoundingClientRect().y,
  });

  const containerSizeObserver = useMemo(
    () =>
      new ResizeObserver(() => {
        if (!tooltipRef.current) return;

        var targetLeft = tooltip.target.getBoundingClientRect().left;
        var targetTop = tooltip.target.getBoundingClientRect().top;
        var targetHeight = tooltip.target.getBoundingClientRect().height;
        var targetWidth = tooltip.target.getBoundingClientRect().width;

        var tooltipHeight = tooltipRef.current.getBoundingClientRect().height;
        var tooltipWidth = tooltipRef.current.getBoundingClientRect().width;

        var predictedPositionX = targetLeft;
        var predictedPositionY = targetTop + targetHeight + 20;

        if (predictedPositionY + tooltipHeight > windowHeight) {
          predictedPositionY = targetTop - tooltipHeight - 20;
        }

        if (predictedPositionX + tooltipWidth > appRect.right) {
          predictedPositionX = targetLeft - tooltipWidth + targetWidth;
        }

        setPosition({
          x: predictedPositionX,
          y: predictedPositionY,
        });
      }),
    [tooltip, tooltipRef, windowWidth, windowHeight]
  );

  useEffect(() => {
    containerSizeObserver.observe(tooltip.target);
    if (tooltipRef.current) containerSizeObserver.observe(tooltipRef.current);
    return () => {
      containerSizeObserver.unobserve(tooltip.target);
      if (tooltipRef.current)
        containerSizeObserver.unobserve(tooltipRef.current);
    };
  }, [containerSizeObserver]);

  return (
    <div
      className={styles.tooltipOverlay}
      style={{ width: `${windowWidth}px`, height: `${windowHeight}px` }}
    >
      <div
        id="tooltip"
        ref={tooltipRef}
        className={styles.message}
        style={{ translate: `${position.x}px ${position.y}px` }}
      >
        {tooltip.message}
      </div>
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
