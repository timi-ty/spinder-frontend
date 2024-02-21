import { useState } from "react";
import { useReadyTracks } from "../../utils/hooks";
import DiscoverTrack from "./DiscoverTrack";
import "../styles/DiscoverDeck.scss";

function DiscoverDeck() {
  const isTracksReady = useReadyTracks(); //Add a loader until tracks get ready.
  const [activeTrackComponent, setActiveTrackComponent] = useState(0);

  return (
    <div className="deck">
      <div className="track-container">
        {isTracksReady && (
          <DiscoverTrack
            isActiveTrack={activeTrackComponent === 0}
            initialTrackIndex={0}
            nextTrackOffset={2}
            onNextTrack={() => setActiveTrackComponent((a) => (a + 1) % 2)}
          />
        )}
        {isTracksReady && (
          <DiscoverTrack
            isActiveTrack={activeTrackComponent === 1}
            initialTrackIndex={1}
            nextTrackOffset={2}
            onNextTrack={() => setActiveTrackComponent((a) => (a + 1) % 2)}
          />
        )}
        {/* An etra view goes here. It shows a loader or a button to reload based on an expectancy state. */}
      </div>
    </div>
  );
}

export default DiscoverDeck;
