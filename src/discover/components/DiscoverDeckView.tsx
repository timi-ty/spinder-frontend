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
import "../styles/DiscoverDeckView.scss";
import { getDeckItem, markVisitedDeckItem } from "../../client/client.deck";
import { InteractionPanelContext } from "../../utils/context";
import { useMouseFlick, useTouchFlick } from "../../utils/hooks";
import { useDispatch } from "react-redux";
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
} from "../../utils/utils";

const dragActionThreshold = 20;

function DiscoverDeckView() {
  const dispatch = useDispatch();
  //The Deck is a three item swap chain. We do this so that there's always a loaded item in front and behind the current one.
  const [activeDeckItemCursor, setActiveDeckItemCursor] = useState(0);
  const [cursor0, setCursor0] = useState(0);
  const [cursor1, setCursor1] = useState(1);
  const [cursor2, setCursor2] = useState(2);

  //The jumping item is the item that will have to change it's absolute position behind the scenes without a transition.
  const [jumpingItemCursor, setJumpingItemCursor] = useState(-1);

  const deckItem0 = useMemo(() => {
    const deckItem = getDeckItem(cursor0);
    dispatch(setDeckItem0(deckItem));
    return deckItem;
  }, [cursor0]);

  const deckItem1 = useMemo(() => {
    const deckItem = getDeckItem(cursor1);
    dispatch(setDeckItem1(deckItem));
    return deckItem;
  }, [cursor1]);

  const deckItem2 = useMemo(() => {
    const deckItem = getDeckItem(cursor2);
    dispatch(setDeckItem2(deckItem));
    return deckItem;
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
        if (cursor2 < cursor0) setCursor2((i) => i + 3); //Only move cursor2 when it is behind cursor1.
        setActiveDeckItemCursor(1);
        setJumpingItemCursor(2); //If we go from 0 to 1, then 2 has to jump.
        break;
      case 1:
        setCursor0((i) => i + 3); //We're moving cursors here to progress through the source deck in a swap chain manner.
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
        if (cursor0 < 3) {
          console.warn("Already at the top. Can't go previous.");
          return;
        } //Reject previous when at the top. We use 3 because cursors increase in 3s.
        setCursor1((i) => i - 3);
        setActiveDeckItemCursor(2);
        setJumpingItemCursor(1); //If we go from 0 to 2, then 1 has to jump.
        break;
      case 1:
        if (cursor1 >= 4) setCursor2((i) => i - 3); //If there is only one place up to go to, leave the 2 index alone.
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

  const interactionContainer = useContext(InteractionPanelContext);
  useEffect(() => {
    interactionContainer.addEventListener("click", onClickPlayPause);
    return () => {
      interactionContainer.removeEventListener("click", onClickPlayPause);
    };
  }, []);

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
      setVerticalTranslation(verticalTranslationRef.current);
    }, frameTimeMillis);
    return () => {
      if (intervalHandle.current) clearInterval(intervalHandle.current);
    };
  }, []);

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
  });

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

  //In order not to reload the image and audio fed into DeckItemView, we only need to makesure that the value passed into mDeckItem does not change until we've used it.
  return (
    <div className="deck">
      <div ref={containerRef} className="deck-items-container">
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
