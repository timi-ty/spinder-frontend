import {
  useDiscoverDestinations,
  useDiscoverSourceTypes,
  useSpotifyProfileData,
} from "../utils/hooks";
import DiscoverTop from "./DiscoverTop";
import DiscoverDeck from "./DiscoverDeck";
import DiscoverBottom from "./DiscoverBottom";
import "./DiscoverContent.scss";
import DiscoverSeeker from "./DiscoverSeeker";

function DiscoverContent() {
  const spotifyProfileData = useSpotifyProfileData();
  const discoverSourceTypes = useDiscoverSourceTypes();
  const discoverDestinations = useDiscoverDestinations();
  return (
    <div className="discover">
      <div className="top">
        <DiscoverTop />
      </div>
      <div className="deck">
        <DiscoverDeck />
      </div>
      <div className="bottom">
        <DiscoverBottom />
      </div>
      <div className="seeker">
        <DiscoverSeeker />
      </div>
    </div>
  );
}

export default DiscoverContent;
