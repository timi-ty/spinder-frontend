import { useSelector } from "react-redux";
import "../styles/DiscoverMiddle.scss";
import { DeckItem } from "../../client/client.model";
import { StoreState } from "../../state/store";

function DiscoverMiddle() {
  const activeDeckItem = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.activeDeckItem
  );

  return (
    <div className="middle">
      <div className="left">
        <div className="track-title">{activeDeckItem.trackName}</div>
        <div className="track-artists">
          {activeDeckItem.artists.map((artist, index) => (
            <span key={artist.artistUri}>{`${artist.artistName}${
              activeDeckItem.artists.length > 0 &&
              index < activeDeckItem.artists.length - 1
                ? ", "
                : ""
            }`}</span>
          ))}
        </div>
      </div>
      <div className="right">
        <img
          className="artist-image"
          src={
            activeDeckItem.artists.length > 0
              ? activeDeckItem.artists[0].artistImage
              : ""
          }
        />
        <img className="like-button" src="/src/assets/ic_like_empty.svg" />
      </div>
    </div>
  );
}

export default DiscoverMiddle;
