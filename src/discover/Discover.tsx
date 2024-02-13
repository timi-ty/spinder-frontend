import {
  useDiscoverDestinations,
  useDiscoverSourceTypes,
  useSpotifyProfileData,
} from "../utils/hooks";
import DiscoverTop from "./DiscoverTop";
import DiscoverDeck from "./DiscoverDeck";
import DiscoverBottom from "./DiscoverBottom";
import DiscoverSeeker from "./DiscoverSeeker";
import "./Discover.scss";

function Discover() {
  const spotifyProfileData = useSpotifyProfileData();
  const discoverSourceTypes = useDiscoverSourceTypes();
  const discoverDestinations = useDiscoverDestinations();
  return (
    <div className="discover">
      <DiscoverTop />
      <DiscoverDeck />
      <DiscoverBottom />
      <DiscoverSeeker />
    </div>
  );
}

export default Discover;
