import { useReadyTracks } from "../utils/hooks";
import DiscoverTrack from "./DiscoverTrack";

function DiscoverDeck() {
  const isTracksReady = useReadyTracks();
  return (
    <>
      {isTracksReady && (
        <DiscoverTrack initialTrackIndex={0} nextTrackOffset={2} />
      )}
      {isTracksReady && (
        <DiscoverTrack initialTrackIndex={1} nextTrackOffset={2} />
      )}
    </>
  );
}

export default DiscoverDeck;
