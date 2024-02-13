import {
  useDiscoverDestinations,
  useDiscoverSourceTypes,
  useSpotifyProfileData,
} from "../utils/hooks";
import DiscoverDeck from "./DiscoverDeck";
import "./DiscoverContent.scss";

function DiscoverContent() {
  const spotifyProfileData = useSpotifyProfileData();
  const discoverSourceTypes = useDiscoverSourceTypes();
  const discoverDestinations = useDiscoverDestinations();
  return (
    <div className="discover">
      <h1 className="discover-header">Discover</h1>
      <div>{spotifyProfileData.display_name}</div>
      <div>{spotifyProfileData.email}</div>
      <ul>
        {discoverSourceTypes.sourceTypes.map((sourceType) => (
          <li key={sourceType}>{`${sourceType} ${
            sourceType == discoverSourceTypes.selectedSourceType
              ? "(SELCETED)"
              : ""
          }`}</li>
        ))}
      </ul>
      <div />
      <ul>
        {discoverDestinations.discoverDestinationPlaylists.map(
          (destinationPlaylist) => (
            <li key={destinationPlaylist.id}>{`${destinationPlaylist.name} ${
              destinationPlaylist.id ==
              discoverDestinations.selectedDestinationId
                ? "(SELCETED)"
                : ""
            }`}</li>
          )
        )}
      </ul>
      <DiscoverDeck />
    </div>
  );
}

export default DiscoverContent;
