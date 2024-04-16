import styles from "../styles/DiscoverBackgroundPanel.module.css";
import { useSelector } from "react-redux";
import { DeckItem } from "../../client/client.model";
import { StoreState } from "../../state/store";
import { ReactNode, createContext, forwardRef, useRef } from "react";

const DiscoverBackgroundContext = createContext(
  document.getElementById("root")
);

const DiscoverBackgroundPanel = forwardRef(function DiscoverBackgroundPanel(
  _props,
  ref: any
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
    <div ref={ref} className={styles.backgroundPanel}>
      <div className={styles.container}>
        <img
          className={`${styles.swapItem} ${
            activeDeckItemCursor === 0 ? "" : `${styles.inactive}`
          }`}
          src={`${deckItem0.image}`}
        />
        <img
          className={`${styles.swapItem} ${
            activeDeckItemCursor === 1 ? "" : `${styles.inactive}`
          }`}
          src={`${deckItem1.image}`}
        />
        <img
          className={`${styles.swapItem} ${
            activeDeckItemCursor === 2 ? "" : `${styles.inactive}`
          }`}
          src={`${deckItem2.image}`}
        />
      </div>
    </div>
  );
});

interface ProviderProps {
  children?: ReactNode;
}

function DiscoverBackgroundProvider({ children }: ProviderProps) {
  const backgroundRef = useRef(null);

  return (
    <DiscoverBackgroundContext.Provider value={backgroundRef.current}>
      <DiscoverBackgroundPanel ref={backgroundRef} />
      {children}
    </DiscoverBackgroundContext.Provider>
  );
}

export default DiscoverBackgroundProvider;

export { DiscoverBackgroundContext };
