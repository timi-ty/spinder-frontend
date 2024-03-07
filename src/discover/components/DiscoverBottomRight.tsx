import { useRef } from "react";
import { useSelector } from "react-redux";
import { DeckItem } from "../../client/client.model";
import SquareImage from "../../generic/components/SquareImage";
import { StoreState } from "../../state/store";
import "../styles/DiscoverBottomRight.scss";
import DiscoverLikeButton from "./DiscoverLikeButton";
import { useSpotifyProfileResource } from "../../utils/hooks";

function DiscoverBottomRight() {
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

  const profileResource = useSpotifyProfileResource();
  const profileImage = useSelector<StoreState, string>((state) =>
    state.userProfileState.data.images.length > 0
      ? state.userProfileState.data.images[0].url
      : ""
  );
  const profleUri = useSelector<StoreState, string>(
    (state) => state.userProfileState.data.uri
  );

  const artistImageContainerRef = useRef(null);
  const rightBottomRef = useRef(null);

  return (
    <div className="bottom-right">
      <div className="top">
        <div ref={artistImageContainerRef} className="artist-image">
          {/* Swap chain here to optimize loading artist images */}
          <a
            className={`swap-item ${
              activeDeckItemCursor === 0 ? "active" : ""
            }`}
            href={`${
              deckItem0.artists.length > 0 ? deckItem0.artists[0].artistUri : ""
            }`}
          >
            <SquareImage
              image={
                deckItem0.artists.length > 0
                  ? deckItem0.artists[0].artistImage
                  : ""
              }
              containerRef={artistImageContainerRef}
              circleCrop
              forceIsWidthLimited
            />
          </a>
          <a
            className={`swap-item ${
              activeDeckItemCursor === 1 ? "active" : ""
            }`}
            href={`${
              deckItem1.artists.length > 0 ? deckItem1.artists[0].artistUri : ""
            }`}
          >
            <SquareImage
              image={
                deckItem1.artists.length > 0
                  ? deckItem1.artists[0].artistImage
                  : ""
              }
              containerRef={artistImageContainerRef}
              circleCrop
              forceIsWidthLimited
            />
          </a>
          <a
            className={`swap-item ${
              activeDeckItemCursor === 2 ? "active" : ""
            }`}
            href={`${
              deckItem2.artists.length > 0 ? deckItem2.artists[0].artistUri : ""
            }`}
          >
            <SquareImage
              image={
                deckItem2.artists.length > 0
                  ? deckItem2.artists[0].artistImage
                  : ""
              }
              containerRef={artistImageContainerRef}
              circleCrop
              forceIsWidthLimited
            />
          </a>
        </div>
        <DiscoverLikeButton />
      </div>
      <div ref={rightBottomRef} className="bottom">
        <a href={`${profileResource === "Loaded" ? profleUri : ""}`}>
          <SquareImage
            image={profileImage}
            containerRef={rightBottomRef}
            circleCrop
            forceIsWidthLimited
          />
        </a>
      </div>
    </div>
  );
}

export default DiscoverBottomRight;
