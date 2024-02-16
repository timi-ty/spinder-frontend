import {
  useDiscoverDestinations,
  useDiscoverSourceTypes,
  useSpotifyProfileData,
} from "../utils/hooks";
import DiscoverTop from "./DiscoverTop";
import DiscoverDeck from "./DiscoverDeck";
import DiscoverBottom from "./DiscoverBottom";
import DiscoverSeeker from "./DiscoverSeeker";
import DiscoverDestinationPicker from "./DiscoverDestinationPicker";
import "./Discover.scss";
import { useCallback, useState } from "react";

function Discover() {
  const spotifyProfileData = useSpotifyProfileData();
  const discoverSourceTypes = useDiscoverSourceTypes();

  const [isSelectingDestination, setIsSelectingDestination] = useState(false);

  return (
    <div className="discover">
      <DiscoverTop
        onClickDestinationPicker={() => setIsSelectingDestination(true)}
      />
      <DiscoverDeck />
      <DiscoverBottom />
      <DiscoverSeeker />
      {isSelectingDestination && (
        <DiscoverDestinationPicker
          onDestinationSelected={() => setIsSelectingDestination(false)}
        />
      )}
    </div>
  );
}

export default Discover;
