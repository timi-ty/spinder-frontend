import { useState } from "react";
import DiscoverTop from "./DiscoverTop";
import DiscoverDeck from "./DiscoverDeck";
import DiscoverBottom from "./DiscoverBottom";
import DiscoverSeeker from "./DiscoverSeeker";
import DiscoverDestinationPicker from "./DiscoverDestinationPicker";
import "../styles/Discover.scss";

function Discover() {
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
