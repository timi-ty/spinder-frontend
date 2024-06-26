import {
  LegacyRef,
  ReactNode,
  createContext,
  useEffect,
  useLayoutEffect,
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
import { normalizeRotation } from "../../utils";
import IconButton from "../../generic/components/IconButton";

const RAD_TO_DEG = 57.2958;
const vertClearance = 30; //px

interface Tooltip {
  message: string;
  target: HTMLElement;
  onTipped?: () => void;
}

interface Props {
  tooltip: Tooltip;
  onOverlayClick: () => void;
  progress: string;
  close: () => void;
}

function TooltipOverlay({ tooltip, onOverlayClick, progress, close }: Props) {
  const tooltipRef: LegacyRef<HTMLDivElement> = useRef(null);
  const pointerRef: LegacyRef<HTMLImageElement> = useRef(null);
  const [windowWidth, windowHeight] = useWindowSize();
  const appRect = useAppRect();
  const [position, setPosition] = useState({
    x: tooltip.target.getBoundingClientRect().x,
    y: tooltip.target.getBoundingClientRect().y,
  });
  const [pointerPosition, setPointerPosition] = useState({
    x: 0,
    y: 0,
  });
  const [rotation, setRotation] = useState(0);

  const containerSizeObserver = useMemo(
    () =>
      new ResizeObserver(() => {
        if (!tooltipRef.current) return;

        const targetRect = tooltip.target.getBoundingClientRect();
        var targetLeft = targetRect.left;
        var targetTop = targetRect.top;
        var targetHeight = targetRect.height;
        var targetWidth = targetRect.width;

        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        var tooltipHeight = tooltipRect.height;
        var tooltipWidth = tooltipRect.width;

        var predictedPositionX = targetLeft;
        var predictedPositionY = targetTop + targetHeight + vertClearance;

        var isAbove = false;
        if (predictedPositionY + tooltipHeight > windowHeight) {
          predictedPositionY = targetTop - tooltipHeight - vertClearance;
          isAbove = true;
        }

        if (predictedPositionX + tooltipWidth > appRect.right) {
          predictedPositionX = targetLeft - tooltipWidth + targetWidth;
        }

        setPosition({
          x: predictedPositionX,
          y: predictedPositionY,
        });

        if (!pointerRef.current) return;
        const pointerRect = pointerRef.current.getBoundingClientRect();
        setPointerPosition({
          x: predictedPositionX + tooltipWidth / 2 - pointerRect.width / 2,
          y: isAbove
            ? predictedPositionY + tooltipHeight - 10
            : predictedPositionY - pointerRect.height + 10,
        });
      }),
    [tooltip, tooltipRef.current, pointerRef.current, windowWidth, windowHeight]
  );

  useLayoutEffect(() => {
    containerSizeObserver.observe(tooltip.target);
    if (tooltipRef.current) containerSizeObserver.observe(tooltipRef.current);
    return () => {
      containerSizeObserver.unobserve(tooltip.target);
      if (tooltipRef.current)
        containerSizeObserver.unobserve(tooltipRef.current);
    };
  }, [containerSizeObserver]);

  useEffect(() => {
    if (!pointerRef.current) return;

    const pointerRect = pointerRef.current.getBoundingClientRect();
    const pointerCenter = {
      x: pointerPosition.x + pointerRect.width / 2,
      y: pointerPosition.y + pointerRect.height / 2,
    };
    const targetRect = tooltip.target.getBoundingClientRect();
    const targetCenter = {
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2,
    };

    const displacement = {
      x: targetCenter.x - pointerCenter.x,
      y: targetCenter.y - pointerCenter.y,
    };
    const angle = Math.atan2(displacement.y, displacement.x) * RAD_TO_DEG;

    setRotation(normalizeRotation(angle + 90)); //90deg offset because of the image orientation
  }, [position]);

  return (
    <div
      className={styles.tooltipOverlay}
      style={{ width: `${windowWidth}px`, height: `${windowHeight}px` }}
      onClick={onOverlayClick}
    >
      <div className={styles.infoContainer}>
        <div className={styles.info}>
          Find music you love on Spindr! <br />
          <br />
          Tap to continue ({progress})
        </div>
      </div>
      <div
        className={styles.close}
        style={{ right: `${appRect.right - appRect.width}px` }}
      >
        <IconButton
          title={"Close"}
          icon={"resources/ic_close.svg"}
          onAction={close}
          matchParentHeight
          showBackground={false}
        />
      </div>
      <div
        id="tooltip"
        ref={tooltipRef}
        className={styles.message}
        style={{ translate: `${position.x}px ${position.y}px` }}
      >
        <img className={styles.messageIcon} src="resources/info.png" />
        {tooltip.message}
      </div>
      <img
        ref={pointerRef}
        className={styles.pointer}
        src="/resources/pointer.png"
        style={{
          rotate: `${rotation}deg`,
          translate: `${pointerPosition.x}px ${pointerPosition.y}px`,
        }}
      />
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
  const [maxTipCount, setMaxTipCount] = useState(0);
  const [seenTips, setSeenTips] = useState(new Set<string>());

  function registerTooltip(tooltip: Tooltip) {
    if (seenTips.has(tooltip.message)) return;
    setSeenTips((oldSeenTips) => {
      const newSeenTips = new Set<string>();
      oldSeenTips.forEach((oldSeenTip) => newSeenTips.add(oldSeenTip));
      newSeenTips.add(tooltip.message);
      return newSeenTips;
    });
    setTooltips((oldTooltips) => {
      const filteredTips = oldTooltips.filter(
        (oldTooltip) => oldTooltip.message !== tooltip.message
      );
      setMaxTipCount((m) => Math.max(m, filteredTips.length + 1));
      return [...filteredTips, tooltip];
    });
  }

  function clearTooltip(tooltip: Tooltip) {
    setTooltips((oldTooltips) =>
      oldTooltips.filter((oldTooltip) => oldTooltip.message !== tooltip.message)
    );
  }

  function clearAll() {
    setTooltips([]);
  }

  useEffect(() => {
    if (tooltips.length > 0) {
      dispatch(setIsTooltipShowing(true));
      const currentTooltip = tooltips[0];
      setCurrentTooltip(currentTooltip);
      if (currentTooltip.onTipped) currentTooltip.onTipped();
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
          progress={`${maxTipCount - tooltips.length + 1}/${maxTipCount}`}
          close={() => clearAll()}
        />
      )}
    </TooltipContext.Provider>
  );
}

export { TooltipContext };

export default TooltipProvider;
