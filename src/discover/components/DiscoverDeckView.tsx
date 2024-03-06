import { useCallback, useContext, useEffect, useState } from "react";
import DiscoverDeckItemView from "./DiscoverDeckItemView";
import "../styles/DiscoverDeckView.scss";
import { getDeckItem, markVisitedDeckItem } from "../../client/client.deck";
import { playAudioElement } from "../../client/client.audio";
import { InteractionPanelContext } from "../../utils/context";
import { useClickDrag } from "../../utils/hooks";
import { useDispatch } from "react-redux";
import { changeActiveDeckItem } from "../../state/slice.deck";

const dragActionThreshold = 20;

function DiscoverDeckView() {
  //The Deck is a three item swap chain. We do this so that there's always a loaded item in front and behind the current one.
  const [activeDeckItemCursor, setActiveDeckItemCursor] = useState(0);
  const [cursor0, setCursor0] = useState(0);
  const [cursor1, setCursor1] = useState(1);
  const [cursor2, setCursor2] = useState(2);

  const getActiveDeckItem = () => {
    return getDeckItem(
      activeDeckItemCursor === 0
        ? cursor0
        : activeDeckItemCursor === 1
        ? cursor1
        : cursor2
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveDeckItem(getActiveDeckItem()));
  }, [activeDeckItemCursor]);

  const nextDeckItemView = useCallback(() => {
    markVisitedDeckItem(getActiveDeckItem()); //Marks the currently displaying deck item as visited before going to the next one.
    switch (activeDeckItemCursor) {
      case 0:
        if (cursor2 < cursor0) setCursor2((i) => i + 3); //Only move cursor2 when it is behind cursor1.
        playAudioElement(1);
        break;
      case 1:
        setCursor0((i) => i + 3);
        playAudioElement(2);
        break;
      case 2:
        setCursor1((i) => i + 3);
        playAudioElement(0);
        break;
    }
    setIsPlaying(true);
    setActiveDeckItemCursor((c) => (c + 1) % 3);
  }, [activeDeckItemCursor, cursor0, cursor2]);

  const previousDeckItemView = useCallback(() => {
    switch (activeDeckItemCursor) {
      case 0:
        if (cursor0 < 3) {
          console.warn("Already at the top. Can't go previous.");
          return;
        } //Reject previous when at the top. We use 3 because cursors increase in 3s.
        setCursor1((i) => i - 3);
        playAudioElement(2);
        break;
      case 1:
        if (cursor1 >= 4) setCursor2((i) => i - 3); //If there is only one place up to go to, leave the 2 index alone.
        playAudioElement(0);
        break;
      case 2:
        setCursor0((i) => i - 3);
        playAudioElement(1);
        break;
    }
    setIsPlaying(true);
    setActiveDeckItemCursor((c) => (c + 2) % 3);
  }, [activeDeckItemCursor, cursor0]);

  const [isPlaying, setIsPlaying] = useState(false);

  const onDragFinish = useCallback(
    (dragDelta: { dx: number; dy: number }) => {
      if (dragDelta.dy < -dragActionThreshold) {
        nextDeckItemView();
      } else if (dragDelta.dy > dragActionThreshold) {
        previousDeckItemView();
      }
    },
    [nextDeckItemView, previousDeckItemView]
  );
  const onClickPlayPause = () => {
    setIsPlaying((p) => !p);
  };

  const interactionContainer = useContext(InteractionPanelContext);

  const clickDragDelta = useClickDrag(
    interactionContainer,
    { absY: 1, absX: 1 },
    onDragFinish,
    onClickPlayPause
  );

  //In order not to reload the image and audio fed into DeckItemView, we only need to makesure that the value passed into mDeckItem does not change until we've used it.
  return (
    <div className="deck">
      <div className="deck-items-container">
        <DiscoverDeckItemView
          deckItemViewIndex={0}
          isActiveDeckItemView={activeDeckItemCursor === 0}
          mDeckItem={getDeckItem(cursor0)}
          zIndex={
            activeDeckItemCursor === 0 ? 2 : activeDeckItemCursor === 2 ? 1 : 0
          }
          clickDragDelta={clickDragDelta}
          isPlaying={isPlaying && activeDeckItemCursor === 0}
        />

        <DiscoverDeckItemView
          deckItemViewIndex={1}
          isActiveDeckItemView={activeDeckItemCursor === 1}
          mDeckItem={getDeckItem(cursor1)}
          zIndex={
            activeDeckItemCursor === 1 ? 2 : activeDeckItemCursor === 0 ? 1 : 0
          }
          clickDragDelta={clickDragDelta}
          isPlaying={isPlaying && activeDeckItemCursor === 1}
        />

        <DiscoverDeckItemView
          deckItemViewIndex={2}
          isActiveDeckItemView={activeDeckItemCursor === 2}
          mDeckItem={getDeckItem(cursor2)}
          zIndex={
            activeDeckItemCursor === 2 ? 2 : activeDeckItemCursor === 1 ? 1 : 0
          }
          clickDragDelta={clickDragDelta}
          isPlaying={isPlaying && activeDeckItemCursor === 2}
        />
      </div>
    </div>
  );
}

export default DiscoverDeckView;
