import { LegacyRef, forwardRef } from "react";
import "../styles/DiscoverBackgroundPanel.scss";
import { useSelector } from "react-redux";
import { DeckItem } from "../../client/client.model";
import { StoreState } from "../../state/store";

const DiscoverBackgroundPanel = forwardRef(function DiscoverInteractionPanel(
  _props,
  ref: LegacyRef<HTMLDivElement>
) {
  const activeDeckItemCursor = useSelector<StoreState, number>(
    (state) => state.deckState.activeDeckItemCursor
  );
  const deckItem0 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem0
  );
  const deckItem1 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem1
  );
  const deckItem2 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem2
  );

  return (
    <div ref={ref} className="background-panel">
      <img></img>
    </div>
  );
});

export default DiscoverBackgroundPanel;
