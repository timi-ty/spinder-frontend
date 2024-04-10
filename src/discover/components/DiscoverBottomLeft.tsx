import { useSelector } from "react-redux";
import { DeckItem, DiscoverSource } from "../../client/client.model";
import { StoreState, dispatch } from "../../state/store";
import {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { changeSource } from "../../client/client.deck";
import { selectDiscoverSource } from "../../state/slice.discoversource";
import "../styles/DiscoverBottomLeft.scss";
import { ToastContext } from "../../overlays/components/ToastProvider";

const gap = 1; //rem

function DiscoverBottomLeft() {
  const showToast = useContext(ToastContext);

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

  const topContainerRef: LegacyRef<HTMLDivElement> = useRef(null);
  const [topContainerHeight, setTopContainerHeight] = useState(0);

  const topContainerSizeObserver = useMemo(
    () =>
      new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            setTopContainerHeight(entry.contentRect.height);
          }
        }
      }),
    []
  );

  useEffect(() => {
    if (topContainerRef.current)
      topContainerSizeObserver.observe(topContainerRef.current);
    return () => {
      if (topContainerRef.current)
        topContainerSizeObserver.unobserve(topContainerRef.current);
    };
  }, [topContainerSizeObserver]);

  return (
    <div className="bottom-left">
      <div ref={topContainerRef} className="top">
        <a href={`${activeDeckItem.trackUri}`}>
          <img
            title="Spotify"
            className="spotify-icon"
            src="/resources/ic_spotify_white.png"
          />
        </a>
        <div className="track-title">
          <a className="link" href={`${activeDeckItem.trackUri}`}>
            <span>{activeDeckItem.trackName}</span>
          </a>
        </div>
        <div className="track-artists">
          {activeDeckItem.artists.map((artist, index) => (
            <a
              key={artist.artistUri}
              className="link"
              href={`${artist.artistUri}`}
            >
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
      <div
        className="bottom"
        style={{ height: `calc(100% - ${topContainerHeight}px - ${gap}rem)` }}
      >
        <div className="related-sources">
          {relatedSources.map((source) => (
            <div
              className="source"
              key={source.id}
              onClick={() => onSourceClick(source)}
            >{`#${source.name}`}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiscoverBottomLeft;
