import { useState } from "react";
import { useReadyTracks } from "../utils/hooks";
import DiscoverTrack from "./DiscoverTrack";

function DiscoverDeck() {
  const isTracksReady = useReadyTracks();
  const [activeTrackComponent, setActiveTrackComponent] = useState(0);

  return (
    <div className="track">
      {isTracksReady && (
        <div
          className="item"
          style={{ zIndex: activeTrackComponent === 0 ? 1 : 0 }}
        >
          <DiscoverTrack
            initialTrackIndex={0}
            nextTrackOffset={2}
            onNextTrack={() => setActiveTrackComponent((a) => (a + 1) % 2)}
          />
        </div>
      )}
      {isTracksReady && (
        <div
          className="item"
          style={{ zIndex: activeTrackComponent === 1 ? 1 : 0 }}
        >
          <DiscoverTrack
            initialTrackIndex={1}
            nextTrackOffset={2}
            onNextTrack={() => setActiveTrackComponent((a) => (a + 1) % 2)}
          />
        </div>
      )}
    </div>
  );
}

export default DiscoverDeck;
