import { useSelector } from "react-redux";
import { DiscoverSource } from "../../client/client.model";
import { StoreState, dispatch } from "../../state/store";
import "../styles/DiscoverBottom.scss";
import { useSpotifyProfileResource } from "../../utils/hooks";
import { MutableRefObject, useCallback, useRef } from "react";
import { changeSource } from "../../client/client.deck";
import { selectDiscoverSource } from "../../state/slice.discoversource";
import { showToast } from "../../toast/ToastOverlay";
import SquareImage from "../../generic/components/SquareImage";

function DiscoverBottom() {
  const relatedSources = useSelector<StoreState, DiscoverSource[]>(
    (state) => state.deckState.activeDeckItem.relatedSources
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

  const rightRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

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
    <div className="bottom">
      <div className="left">
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
      <div ref={rightRef} className="right">
        <div className="profile">
          {profileResource === "Loaded" && (
            <a href={`${profleUri}`}>
              <SquareImage
                image={profileImage}
                containerRef={rightRef}
                circleCrop
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscoverBottom;
