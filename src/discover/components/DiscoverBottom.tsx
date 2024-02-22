import { useSelector } from "react-redux";
import { DiscoverSource } from "../../client/client.model";
import { StoreState } from "../../state/store";
import "../styles/DiscoverBottom.scss";
import { useSpotifyProfileResource } from "../../utils/hooks";

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

  return (
    <div className="bottom">
      <div className="left">
        <div className="related-sources">
          {relatedSources.map((source) => (
            <div className="source" key={source.id}>{`#${source.name}`}</div>
          ))}
        </div>
      </div>
      <div className="right">
        <div className="profile">
          {profileResource === "Loaded" && (
            <img className="image" src={profileImage} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscoverBottom;
