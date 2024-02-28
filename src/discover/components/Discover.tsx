import { useState } from "react";
import DiscoverTop from "./DiscoverTop";
import DiscoverDeckView from "./DiscoverDeckView";
import DiscoverBottom from "./DiscoverBottom";
import DiscoverSeeker from "./DiscoverSeeker";
import DiscoverDestinationPicker from "./DiscoverDestinationPicker";
import "../styles/Discover.scss";
import DiscoverSourcePicker from "./DiscoverSourcePicker";
import DiscoverMiddle from "./DiscoverMiddle";
import { useDeck } from "../../utils/hooks";

function Discover() {
  const isDeckReady = useDeck(); //Add a loader until deck get ready.
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const [isSelectingSource, setIsSelectingSource] = useState(false);

  return (
    <div className="discover">
      <DiscoverTop
        onClickDestinationPicker={() => setIsSelectingDestination(true)}
        onClickSourcePicker={() => setIsSelectingSource(true)}
      />
      {isDeckReady && <DiscoverDeckView />}
      {isDeckReady && <DiscoverMiddle />}
      {isDeckReady && <DiscoverBottom />}
      {isDeckReady && <DiscoverSeeker />}
      {isSelectingDestination && (
        <DiscoverDestinationPicker
          close={() => setIsSelectingDestination(false)}
        />
      )}
      {isSelectingSource && (
        <DiscoverSourcePicker close={() => setIsSelectingSource(false)} />
      )}
    </div>
  );
}

export default Discover;
