import { useMemo, useState } from "react";
import { nextTrack } from "../client/client.deck";

interface Props {
  initialTrackIndex: number;
  nextTrackOffset: number;
}

function DiscoverTrack({ initialTrackIndex, nextTrackOffset }: Props) {
  const firstTrack = useMemo(
    () => nextTrack(null, initialTrackIndex),
    [initialTrackIndex]
  );
  const [activeTrackIndex, setActiveTrackIndex] = useState(initialTrackIndex);
  const [activeTrack, setActiveTrack] = useState(firstTrack);

  function onClickNext() {
    const newTrack = nextTrack(activeTrack, activeTrackIndex + nextTrackOffset);
    if (newTrack) {
      setActiveTrack(newTrack);
      setActiveTrackIndex((n) => (n += nextTrackOffset));
    }
  }

  return (
    <>
      {activeTrack === null ? (
        <div>No Valid Track Here</div>
      ) : (
        <>
          <audio controls src={activeTrack.previewUrl} />
          <button onClick={onClickNext}>Next Track</button>
        </>
      )}
    </>
  );
}

export default DiscoverTrack;
