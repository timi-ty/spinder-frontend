import {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DiscoverDeckItemView from "./DiscoverDeckItemView";
import styles from "../styles/DiscoverDeckView.module.css";
import { getDeckItem, markVisitedDeckItem } from "../../client/client.deck";
import { useDispatch, useSelector } from "react-redux";
import {
  changeActiveDeckItem,
  setDeckItem0,
  setDeckItem1,
  setDeckItem2,
} from "../../state/slice.deck";
import {
  isMobileTouchDevice,
  lerp,
  nullTimeoutHandle,
  remToPx,
} from "../../utils";
import { StoreState } from "../../state/store";
import { DeckItem } from "../../client/client.model";
import { DiscoverBackgroundContext } from "./DiscoverBackgroundPanel";
import useMouseFlick from "../../utility-hooks/useMouseFlick";
import useTouchFlick from "../../utility-hooks/useTouchFlick";
import { TooltipContext } from "../../overlays/components/TooltipProvider";

const dragActionThreshold = 20;

function DiscoverDeckView() {
  const dispatch = useDispatch();
  //The Deck is a three item swap chain. We do this so that there's always a loaded item in front and behind the current one.
  const [activeDeckItemCursor, setActiveDeckItemCursor] = useState(0);
  const [cursor2, setCursor2] = useState(-1); //Starts behind the active
  const [cursor0, setCursor0] = useState(0); //Starts as the active
  const [cursor1, setCursor1] = useState(1); //Starts in front of the active

  //The jumping item is the item that will have to change it's absolute position behind the scenes without a transition.
  const [jumpingItemCursor, setJumpingItemCursor] = useState(-1);

  const deckItem0 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem0
  );
  useEffect(() => {
    const deckItem = getDeckItem(cursor0);
    dispatch(setDeckItem0(deckItem));
  }, [cursor0]);

  const deckItem1 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem1
  );
  useEffect(() => {
    const deckItem = getDeckItem(cursor1);
    dispatch(setDeckItem1(deckItem));
  }, [cursor1]);

  const deckItem2 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem2
  );
  useEffect(() => {
    const deckItem = getDeckItem(cursor2);
    dispatch(setDeckItem2(deckItem));
  }, [cursor2]);

  const activeDeckItem = useMemo(() => {
    return activeDeckItemCursor === 0
      ? deckItem0
      : activeDeckItemCursor === 1
      ? deckItem1
      : deckItem2;
  }, [activeDeckItemCursor]);

  useEffect(() => {
    dispatch(changeActiveDeckItem(activeDeckItemCursor));
  }, [activeDeckItemCursor]);

  const nextDeckItemView = useCallback(() => {
    markVisitedDeckItem(activeDeckItem); //Marks the currently displaying deck item as visited before going to the next one.
    switch (activeDeckItemCursor) {
      case 0:
        setCursor2((i) => i + 3); //We're moving cursors here to progress through the source deck in a swap chain manner.
        setActiveDeckItemCursor(1);
        setJumpingItemCursor(2); //If we go from 0 to 1, then 2 has to jump.
        break;
      case 1:
        setCursor0((i) => i + 3);
        setActiveDeckItemCursor(2);
        setJumpingItemCursor(0); //If we go from 1 to 2, then 0 has to jump.
        break;
      case 2:
        setCursor1((i) => i + 3);
        setActiveDeckItemCursor(0);
        setJumpingItemCursor(1); //If we go from 2 to 0, then 1 has to jump.
        break;
    }
    setIsPlaying(true);
  }, [activeDeckItemCursor, cursor0, cursor2]);

  const previousDeckItemView = useCallback(() => {
    switch (activeDeckItemCursor) {
      case 0:
        setCursor1((i) => i - 3);
        setActiveDeckItemCursor(2);
        setJumpingItemCursor(1); //If we go from 0 to 2, then 1 has to jump.
        break;
      case 1:
        setCursor2((i) => i - 3);
        setActiveDeckItemCursor(0);
        setJumpingItemCursor(2); //If we go from 1 to 0, then 2 has to jump.
        break;
      case 2:
        setCursor0((i) => i - 3);
        setActiveDeckItemCursor(1);
        setJumpingItemCursor(0); //If we go from 2 to 1, then 0 has to jump.
        break;
    }
    setIsPlaying(true);
  }, [activeDeckItemCursor, cursor0]);

  const [isPlaying, setIsPlaying] = useState(false);
  const doPlayPauseClick = useRef(true); //Used to block pausing when changing tracks.

  const verticalTranslationRef = useRef(0);
  const [verticalTranslation, setVerticalTranslation] = useState(0);

  const [transitionTranslate, setTransitionTranslate] = useState(false);

  const onFlickFinish = useCallback(
    (dragDelta: { dx: number; dy: number }) => {
      setJumpingItemCursor(-1); //Before calling next or previous, we assume that no item needs to jump since it's possible for a drag to be cosmetic.
      verticalTranslationRef.current = 0; //As soon as drag finishes, reset the progressive vertical translation.
      setVerticalTranslation(0);
      setTransitionTranslate(true);
      if (dragDelta.dy < -dragActionThreshold) {
        doPlayPauseClick.current = false; //Any click action dispatched immediately after this flick should be ignored as the gesture was handled as a flick.
        setTimeout(() => (doPlayPauseClick.current = true), 200); //We assume that any click action 200ms after the click is independent of the flick gesture.
        nextDeckItemView();
      } else if (dragDelta.dy > dragActionThreshold) {
        doPlayPauseClick.current = false;
        setTimeout(() => (doPlayPauseClick.current = true), 200);
        previousDeckItemView();
      }
    },
    [nextDeckItemView, previousDeckItemView]
  );

  const onClickPlayPause = useCallback(() => {
    if (doPlayPauseClick.current) setIsPlaying((p) => !p);
    doPlayPauseClick.current = true;
  }, []);

  const interactionContainer = useContext(DiscoverBackgroundContext);
  useEffect(() => {
    interactionContainer?.addEventListener("click", onClickPlayPause);
    return () => {
      interactionContainer?.removeEventListener("click", onClickPlayPause);
    };
  }, []);

  //Pause when picking source or destination or showing a popup.
  const isSourcePickerOpen = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isSourcePickerOpen
  );
  const isDestinationPickerOpen = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isDestinationPickerOpen
  );
  const isPopupShowing = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isPopupShowing
  );
  useEffect(() => {
    if (isSourcePickerOpen || isDestinationPickerOpen || isPopupShowing)
      setIsPlaying(false);
  }, [isSourcePickerOpen, isDestinationPickerOpen, isPopupShowing]);

  const containerRef: LegacyRef<HTMLDivElement> = useRef(null);
  const [viewHeight, setViewHeight] = useState(0);

  const containerSizeObserver = useMemo(
    () =>
      new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            setViewHeight(entry.contentRect.height);
          }
        }
      }),
    []
  );

  useEffect(() => {
    if (containerRef.current)
      containerSizeObserver.observe(containerRef.current);
    return () => {
      if (containerRef.current)
        containerSizeObserver.unobserve(containerRef.current);
    };
  }, [containerSizeObserver]);

  const clickDragDelta = isMobileTouchDevice()
    ? useTouchFlick(() => setTransitionTranslate(false), onFlickFinish)
    : useMouseFlick(() => setTransitionTranslate(false), onFlickFinish);

  const clickDragDeltaRef = useRef(clickDragDelta);
  clickDragDeltaRef.current = clickDragDelta; //Ref to break away from closure.
  const intervalHandle = useRef(nullTimeoutHandle);
  const frameTimeMillis = 16; //60fps
  //This effect starts a 60fps animator for the item translation.
  useEffect(() => {
    if (intervalHandle.current) clearInterval(intervalHandle.current);
    intervalHandle.current = setInterval(() => {
      verticalTranslationRef.current = smoothValue(
        verticalTranslationRef.current,
        clickDragDeltaRef.current.dy,
        frameTimeMillis
      );
      const sign = verticalTranslationRef.current < 0 ? -1 : 1;
      const clampedTranslation =
        sign * Math.min(Math.abs(verticalTranslationRef.current), viewHeight); //Don't allow translation more than 1 height up or down
      setVerticalTranslation(clampedTranslation);
    }, frameTimeMillis);
    return () => {
      if (intervalHandle.current) clearInterval(intervalHandle.current);
    };
  }, [viewHeight]);

  const getItemTop = (itemCursor: number) => {
    switch (activeDeckItemCursor) {
      case 0: //If 0 is active, 2 should be ontop of it and 1 below it.
        return itemCursor === 1
          ? viewHeight + remToPx(0.5) //Half rem gap
          : itemCursor === 2
          ? -(viewHeight + remToPx(0.5))
          : 0;
      case 1: //If 1 is active, 0 should be ontop of it and 2 below it.
        return itemCursor === 0
          ? -(viewHeight + remToPx(0.5))
          : itemCursor === 2
          ? viewHeight + remToPx(0.5)
          : 0;
      case 2: //If 2 is active, 1 should be ontop of it and 0 below it.
        return itemCursor === 0
          ? viewHeight + remToPx(0.5)
          : itemCursor === 1
          ? -(viewHeight + remToPx(0.5))
          : 0;
      default:
        return 0;
    }
  };

  const registerTooltip = useContext(TooltipContext);

  useEffect(() => {
    if (containerRef.current)
      registerTooltip({
        message:
          "Swipe 👆 up ↑ or down ↓ to scroll through your recommendations",
        target: containerRef.current,
      });
  }, [containerRef.current]);

  //In order not to reload the image and audio fed into DeckItemView, we only need to makesure that the value passed into mDeckItem does not change until we've used it.
  return (
    <div className={styles.deck}>
      <div ref={containerRef} className={styles.deckItemsContainer}>
        <DiscoverDeckItemView
          deckItemViewIndex={0}
          mDeckItem={deckItem0}
          isPlaying={isPlaying && activeDeckItemCursor === 0}
          verticalTranslation={getItemTop(0) + verticalTranslation}
          transitionTranslate={transitionTranslate && jumpingItemCursor !== 0}
        />

        <DiscoverDeckItemView
          deckItemViewIndex={1}
          mDeckItem={deckItem1}
          isPlaying={isPlaying && activeDeckItemCursor === 1}
          verticalTranslation={getItemTop(1) + verticalTranslation}
          transitionTranslate={transitionTranslate && jumpingItemCursor !== 1}
        />

        <DiscoverDeckItemView
          deckItemViewIndex={2}
          mDeckItem={deckItem2}
          isPlaying={isPlaying && activeDeckItemCursor === 2}
          verticalTranslation={getItemTop(2) + verticalTranslation}
          transitionTranslate={transitionTranslate && jumpingItemCursor !== 2}
        />
      </div>
    </div>
  );
}

const smoothingConstant = 12;

function smoothValue(
  from: number,
  to: number,
  deltaTimeMillis: number
): number {
  return lerp(from, to, (smoothingConstant * deltaTimeMillis) / 1000); //Using lerp with feedback makes it non-linear and nice.
}

export default DiscoverDeckView;
