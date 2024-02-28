import { useState } from "react";
import { useSelector } from "react-redux";
import { DeckItem } from "../../client/client.model";
import { StoreState } from "../../state/store";
import { isDeckItemSaved, saveDeckItem } from "../../client/client.deck";

function DiscoverLikeButton() {
  const activeDeckItem = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.activeDeckItem
  );

  const [isLiked, setIsLiked] = useState(isDeckItemSaved(activeDeckItem));

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
                /*show saved success message*/
              },
              () => {
                /*show error message*/
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
            saveDeckItem(
              activeDeckItem,
              () => {
                /*show un-saved success message*/
              },
              () => {
                /*show error message*/
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
