import { useSelector } from "react-redux";
import { DeckItem, DiscoverSource } from "../../client/client.model";
import { StoreState, dispatch } from "../../state/store";
import { useCallback } from "react";
import { changeSource } from "../../client/client.deck";
import { selectDiscoverSource } from "../../state/slice.discoversource";
import { showToast } from "../../toast/ToastOverlay";
import "../styles/DiscoverBottomLeft.scss";

function DiscoverBottomLeft() {
  const activeDeckItem = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.activeDeckItem
  );
  const relatedSources = useSelector<StoreState, DiscoverSource[]>(
    (state) => state.deckState.activeDeckItem.relatedSources
  );

  const onSourceClick = useCallback((source: DiscoverSource) => {
    changeSource(
      source,
      (newSource) => {
        dispatch(selectDiscoverSource(newSource));
      },
      () => {
        showToast(
          "Something went wrong, your source did not change.",
          "Bottom"
        );
      }
    );
  }, []);

  return (
    <div className="bottom-left">
      <div className="top">
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
      <div className="bottom">
        <div className="related-sources">
          {relatedSources.map((source) => (
            <div
              className="source"
              key={source.id}
              onClick={() => onSourceClick(source)}
            >{`#${source.name}`}</div>
          ))}
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
          <div className="source">#related source</div>
        </div>
      </div>
    </div>
  );
}

export default DiscoverBottomLeft;
