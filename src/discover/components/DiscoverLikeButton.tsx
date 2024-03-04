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
import { nullTimeoutHandle } from "../../utils/utils";

const settleTimeInMillis = 1000; //1 second time to settle.

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
  const [isLocallyControlled, setIsLocallyControlled] = useState(false); //At the start, allow externally sourced like updates.

  useEffect(() => {
    setIsLiked(isDeckItemSaved(activeDeckItem)); //Whether or not we are on local control, change in deck item updates the like state.
    setIsLocallyControlled(false); //Each time the active deck item changes, allow externally sourced like updates. (Source of truth).
  }, [activeDeckItem]);

  useEffect(() => {
    if (isLocallyControlled) return; //If liking is under local control, ignore external updates.
    setIsLiked(isDeckItemSaved(activeDeckItem));
  }, [savedItemsCount]);

  const containerRef = useRef(null);
  const lastActionTimestamp = useRef(Date.now());

  //Instead of dispatching the like action on every click, we allow the action to settle for a period before dispatching.
  const lastTimeoutHandle = useRef(nullTimeoutHandle);
  const dispatchLikeOnSettle = (actionTimestamp: number) => {
    if (lastTimeoutHandle.current) {
      clearTimeout(lastTimeoutHandle.current); //Before we start a new timer to dispatch the current like action, cancel the timer for the last like action.
    }
    lastTimeoutHandle.current = setTimeout(() => {
      if (isLiked) {
        unsaveDeckItem(
          activeDeckItem,
          () => {
            if (actionTimestamp !== lastActionTimestamp.current) return; //Stale actions have no UI effect.
            showToast(
              `${activeDeckItem.trackName} removed from ${destination.name}`,
              "Bottom"
            );
          },
          () => {
            if (actionTimestamp !== lastActionTimestamp.current) return; //Stale actions have no UI effect.
            showToast("Something went wrong. Could not remove", "Bottom");
            setIsLiked(true);
          }
        );
      } else {
        saveDeckItem(
          activeDeckItem,
          () => {
            if (actionTimestamp !== lastActionTimestamp.current) return; //Stale actions have no UI effect.
            showToast(
              `${activeDeckItem.trackName} saved to ${destination.name}`,
              "Bottom"
            );
          },
          () => {
            if (actionTimestamp !== lastActionTimestamp.current) return; //Stale actions have no UI effect.
            showToast("Something went wrong. Could not save", "Bottom");
            setIsLiked(false);
          }
        );
      }
    }, settleTimeInMillis);
  };

  return (
    <div
      ref={containerRef}
      className="like-button"
      onClick={() => {
        setIsLocallyControlled(true); //Any time the user interacts with the like button, switch to local control.
        const actionTimestamp = Date.now(); //We intentionally closure this so it always represents the click time of this particular action.
        lastActionTimestamp.current = actionTimestamp; //The ref here will be closured by reference and so will always return it's most up-to-date value.
        dispatchLikeOnSettle(actionTimestamp);
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
