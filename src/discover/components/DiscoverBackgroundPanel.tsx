import { LegacyRef, forwardRef } from "react";
import "../styles/DiscoverBackgroundPanel.scss";
import { useSelector } from "react-redux";
import { DeckItem } from "../../client/client.model";
import { StoreState } from "../../state/store";

const DiscoverBackgroundPanel = forwardRef(function DiscoverBackgroundPanel(
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
      <img
        className={`swap-item ${activeDeckItemCursor === 0 ? "" : "inactive"}`}
        src={`${deckItem0.image}`}
      />
      <img
        className={`swap-item ${activeDeckItemCursor === 1 ? "" : "inactive"}`}
        src={`${deckItem1.image}`}
      />
      <img
        className={`swap-item ${activeDeckItemCursor === 2 ? "" : "inactive"}`}
        src={`${deckItem2.image}`}
      />
    </div>
  );
});

export default DiscoverBackgroundPanel;
