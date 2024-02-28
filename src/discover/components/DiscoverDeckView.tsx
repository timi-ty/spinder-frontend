import { useState } from "react";
import DiscoverDeckItemView from "./DiscoverDeckItemView";
import "../styles/DiscoverDeckView.scss";
import { getDeckItem, markVisitedDeckItem } from "../../client/client.deck";
import { playAudioElement } from "../../client/client.audio";
import { DeckItem } from "../../client/client.model";

function DiscoverDeckView() {
  //The Deck is a three item swap chain. We do this so that there's always a loaded item in front and behind the current one.
  const [activeDeckItemCursor, setActiveDeckItemCursor] = useState(0);
  const [cursor0, setCursor0] = useState(0);
  const [cursor1, setCursor1] = useState(1);
  const [cursor2, setCursor2] = useState(2);

  const onNextDeckItemView = (
    deckItemCursor: number,
    currentDeckItem: DeckItem
  ) => {
    if (deckItemCursor != activeDeckItemCursor) {
      throw new Error(
        `Only active deck item views can be interactive. Active: ${activeDeckItemCursor}, Interactive: ${deckItemCursor}`
      );
    }
    markVisitedDeckItem(currentDeckItem); //Marks the currently displaying deck item as visited before going to the next one.
    switch (deckItemCursor) {
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
    setActiveDeckItemCursor((c) => (c + 1) % 3);
  };
  const onPreviousDeckItemView = (deckItemCursor: number) => {
    if (deckItemCursor != activeDeckItemCursor) {
      throw new Error(
        `Only active deck item views can be interactive. Active: ${activeDeckItemCursor}, Interactive: ${deckItemCursor}`
      );
    }
    switch (deckItemCursor) {
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
    setActiveDeckItemCursor((c) => (c + 2) % 3);
  };

  //In order not to reload the image and audio fed into DeckItemView, we only need to makesure that the value passed into mTrack does not change until we've used it.
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
          onNext={onNextDeckItemView}
          onPrevious={onPreviousDeckItemView}
        />

        <DiscoverDeckItemView
          deckItemViewIndex={1}
          isActiveDeckItemView={activeDeckItemCursor === 1}
          mDeckItem={getDeckItem(cursor1)}
          zIndex={
            activeDeckItemCursor === 1 ? 2 : activeDeckItemCursor === 0 ? 1 : 0
          }
          onNext={onNextDeckItemView}
          onPrevious={onPreviousDeckItemView}
        />

        <DiscoverDeckItemView
          deckItemViewIndex={2}
          isActiveDeckItemView={activeDeckItemCursor === 2}
          mDeckItem={getDeckItem(cursor2)}
          zIndex={
            activeDeckItemCursor === 2 ? 2 : activeDeckItemCursor === 1 ? 1 : 0
          }
          onNext={onNextDeckItemView}
          onPrevious={onPreviousDeckItemView}
        />
      </div>
    </div>
  );
}

export default DiscoverDeckView;
