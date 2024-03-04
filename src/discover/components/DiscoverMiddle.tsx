import { useSelector } from "react-redux";
import "../styles/DiscoverMiddle.scss";
import { DeckItem } from "../../client/client.model";
import { StoreState } from "../../state/store";
import DiscoverLikeButton from "./DiscoverLikeButton";
import SquareImage from "../../generic/components/SquareImage";
import { useRef } from "react";

function DiscoverMiddle() {
  const activeDeckItem = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.activeDeckItem
  );
  const rightTopRef = useRef(null);

  return (
    <div className="middle">
      <div className="left">
        <a href={`${activeDeckItem.trackUri}`}>
          <img className="spotify-icon" src="src/assets/ic_spotify_black.png" />
        </a>
        <a href={`${activeDeckItem.trackUri}`}>
          <div className="track-title">{activeDeckItem.trackName}</div>
        </a>
        <div className="track-artists">
          {activeDeckItem.artists.map((artist, index) => (
            <a key={artist.artistUri} href={`${artist.artistUri}`}>
              <span>{`${artist.artistName}${
                activeDeckItem.artists.length > 0 &&
                index < activeDeckItem.artists.length - 1
                  ? ", "
                  : ""
              }`}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="right">
        <div ref={rightTopRef} className="top">
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
              containerRef={rightTopRef}
              circleCrop
            />
          </a>
        </div>
        <div className="bottom">
          <DiscoverLikeButton />
        </div>
      </div>
    </div>
  );
}

export default DiscoverMiddle;
