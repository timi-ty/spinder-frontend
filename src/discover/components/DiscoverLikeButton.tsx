import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DeckItem, DiscoverDestination } from "../../client/client.model";
import { StoreState } from "../../state/store";
import {
  isDeckItemSaved,
  saveDeckItem,
  unsaveDeckItem,
} from "../../client/client.deck";
import SquareImage from "../../generic/components/SquareImage";
import { nullTimeoutHandle } from "../../utils";
import { ToastContext } from "../../overlays/components/ToastProvider";
import useAction from "../../utility-hooks/useAction";
import { AuthMode } from "../../state/slice.auth";

const settleTimeInMillis = 1000; //1 second time to settle.

function DiscoverLikeButton() {
  const showToast = useContext(ToastContext);
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

  //Control the like animation
  const [isAnimating, setIsAnimating] = useState(false);
  const stopAnimationTimeoutHandle = useRef(nullTimeoutHandle);
  useEffect(() => {
    if (isLiked) {
      if (stopAnimationTimeoutHandle.current)
        clearTimeout(stopAnimationTimeoutHandle.current);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 250); //Pulse animation lasts for 0.25s.
    }
  }, [isLiked]);

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
  const dispatchLikeTimeoutHandle = useRef(nullTimeoutHandle);
  const dispatchLikeOnSettle = (actionTimestamp: number) => {
    if (dispatchLikeTimeoutHandle.current) {
      clearTimeout(dispatchLikeTimeoutHandle.current); //Before we start a new timer to dispatch the current like action, cancel the timer for the last like action.
    }
    dispatchLikeTimeoutHandle.current = setTimeout(() => {
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

  const doAction = useAction();

  function onClickLike() {
    setIsLocallyControlled(true); //Any time the user interacts with the like button, switch to local control.
    const actionTimestamp = Date.now(); //We intentionally closure this so it always represents the click time of this particular action.
    lastActionTimestamp.current = actionTimestamp; //The ref here will be closured by reference and so will always return it's most up-to-date value.
    dispatchLikeOnSettle(actionTimestamp);
    setIsLiked((liked) => !liked);
  }

  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
  );

  return (
    <div
      ref={containerRef}
      className={`like-button ${isAnimating ? "animate" : ""} ${
        authMode === "Full" ? "" : "unauth-action"
      }`}
      onClick={() => {
        doAction(onClickLike, {
          requiresFullAuth: true,
          actionDescription: "save items (add songs to your playlists)",
        });
      }}
    >
      {
        <SquareImage
          image={
            isLiked
              ? "/resources/ic_like_filled.svg"
              : "/resources/ic_like_empty.svg"
          }
          containerRef={containerRef}
          forceIsWidthLimited
          title={`${isLiked ? "Unlike" : "Like"}`}
        />
      }
    </div>
  );
}

export default DiscoverLikeButton;
