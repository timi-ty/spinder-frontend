import { useState } from "react";
import { useDeck } from "../../utils/hooks";
import DiscoverDeckItemView from "./DiscoverDeckItemView";
import "../styles/DiscoverDeckView.scss";
import { getDeckItem } from "../../client/client.deck";
import { playAudioElement } from "../../client/client.audio";

function DiscoverDeckView() {
  const isDeckReady = useDeck(); //Add a loader until deck get ready.
  //The Deck is a three item swap chain. We do this so that there's always a loaded item in front and behind the current one.
  const [activeDeckItemCursor, setActiveDeckItemCursor] = useState(0);
  const [cursor0, setCursor0] = useState(0);
  const [cursor1, setCursor1] = useState(1);
  const [cursor2, setCursor2] = useState(2);

  const onNextDeckItemView = (deckItemCursor: number) => {
    if (deckItemCursor != activeDeckItemCursor) {
      throw new Error(
        `Only active deck item views can be interactive. Active: ${activeDeckItemCursor}, Interactive: ${deckItemCursor}`
      );
    }
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
    console.log(
      `Setting new active cursor, old: ${activeDeckItemCursor}, new: ${
        (activeDeckItemCursor + 1) % 3
      }`
    );
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
        {isDeckReady && (
          <DiscoverDeckItemView
            deckItemViewIndex={0}
            isActiveDeckItemView={activeDeckItemCursor === 0}
            mTrack={getDeckItem(cursor0)}
            onNext={onNextDeckItemView}
            onPrevious={onPreviousDeckItemView}
          />
        )}
        {isDeckReady && (
          <DiscoverDeckItemView
            deckItemViewIndex={1}
            isActiveDeckItemView={activeDeckItemCursor === 1}
            mTrack={getDeckItem(cursor1)}
            onNext={onNextDeckItemView}
            onPrevious={onPreviousDeckItemView}
          />
        )}
        {isDeckReady && (
          <DiscoverDeckItemView
            deckItemViewIndex={2}
            isActiveDeckItemView={activeDeckItemCursor === 2}
            mTrack={getDeckItem(cursor2)}
            onNext={onNextDeckItemView}
            onPrevious={onPreviousDeckItemView}
          />
        )}
        {/* An etra view goes here. It shows a loader or a button to reload based on an expectancy state. */}
      </div>
    </div>
  );
}

export default DiscoverDeckView;
