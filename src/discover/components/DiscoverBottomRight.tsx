import { useRef } from "react";
import { useSelector } from "react-redux";
import { DeckItem } from "../../client/client.model";
import SquareImage from "../../generic/components/SquareImage";
import { StoreState } from "../../state/store";
import "../styles/DiscoverBottomRight.scss";
import DiscoverLikeButton from "./DiscoverLikeButton";
import { useSpotifyProfileResource } from "../../utils/hooks";

function DiscoverBottomRight() {
  const activeDeckItem = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.activeDeckItem
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

  const artistImageRef = useRef(null);
  const rightBottomRef = useRef(null);

  return (
    <div className="bottom-right">
      <div className="top">
        <div ref={artistImageRef} className="artist-image">
          <a
            href={`${
              activeDeckItem.artists.length > 0
                ? activeDeckItem.artists[0].artistUri
                : ""
            }`}
          >
            <SquareImage
              image={
                activeDeckItem.artists.length > 0
                  ? activeDeckItem.artists[0].artistImage
                  : ""
              }
              containerRef={artistImageRef}
              circleCrop
              forceIsWidthLimited
            />
          </a>
        </div>
        <DiscoverLikeButton />
      </div>
      <div ref={rightBottomRef} className="bottom">
        {profileResource === "Loaded" && (
          <a href={`${profleUri}`}>
            <SquareImage
              image={profileImage}
              containerRef={rightBottomRef}
              circleCrop
              forceIsWidthLimited
            />
          </a>
        )}
      </div>
    </div>
  );
}

export default DiscoverBottomRight;
