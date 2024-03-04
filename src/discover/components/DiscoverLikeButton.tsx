import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DeckItem, DiscoverDestination } from "../../client/client.model";
import { StoreState } from "../../state/store";
import {
  isDeckItemSaved,
  saveDeckItem,
  unsaveDeckItem,
} from "../../client/client.deck";
import { showToast } from "../../toast/ToastOverlay";
import SquareImage from "../../generic/components/SquareImage";

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

  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="like-button"
      onClick={() => {
        if (isLiked) {
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
        } else {
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
        }
        setIsLiked((liked) => !liked);
      }}
    >
      {
        <SquareImage
          image={
            isLiked
              ? "/src/assets/ic_like_filled.svg"
              : "/src/assets/ic_like_empty.svg"
          }
          containerRef={containerRef}
          forceIsWidthLimited
        />
      }
    </div>
  );
}

export default DiscoverLikeButton;
