import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DeckItem, DiscoverDestination } from "../../client/client.model";
import { StoreState } from "../../state/store";
import {
  isDeckItemSaved,
  saveDeckItem,
  unsaveDeckItem,
} from "../../client/client.deck";
import { showToast } from "../../toast/ToastOverlay";

function DiscoverLikeButton() {
  const activeDeckItem = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.activeDeckItem
  );
  const savedItemsCount = useSelector<StoreState, number>(
    (state) => state.deckState.destinationDeckSize
  );
  const destination = useSelector<StoreState, DiscoverDestination>(
    (state) => state.discoverDestinationState.data.selectedDestination
  );

  const [isLiked, setIsLiked] = useState(isDeckItemSaved(activeDeckItem));

  useEffect(() => {
    setIsLiked(isDeckItemSaved(activeDeckItem));
  }, [activeDeckItem, savedItemsCount]);

  return (
    <>
      {!isLiked && (
        <img
          className="like-button"
          src="/src/assets/ic_like_empty.svg"
          onClick={() => {
            setIsLiked(true);
            saveDeckItem(
              activeDeckItem,
              () => {
                showToast(
                  `${activeDeckItem.trackName} saved to ${destination.name}`,
                  "Bottom"
                );
              },
              () => {
                showToast("Something went wrong. Could not save", "Bottom");
                setIsLiked(false);
              }
            );
          }}
        />
      )}
      {isLiked && (
        <img
          className="like-button"
          src="/src/assets/ic_like_filled.svg"
          onClick={() => {
            setIsLiked(false);
            unsaveDeckItem(
              destination,
              activeDeckItem,
              () => {
                showToast(
                  `${activeDeckItem.trackName} removed from ${destination.name}`,
                  "Bottom"
                );
              },
              () => {
                showToast("Something went wrong. Could not remove", "Bottom");
                setIsLiked(true);
              }
            );
          }}
        />
      )}
    </>
  );
}

export default DiscoverLikeButton;
