import { useMemo, useState } from "react";
import { nextTrack } from "../client/client.deck";

interface Props {
  initialTrackIndex: number;
  nextTrackOffset: number;
}

function DiscoverTrack({ initialTrackIndex, nextTrackOffset }: Props) {
  const firstTrack = useMemo(
    () => nextTrack(null, initialTrackIndex, false),
    [initialTrackIndex]
  );
  const [activeTrackIndex, setActiveTrackIndex] = useState(initialTrackIndex);
  const [activeTrack, setActiveTrack] = useState(firstTrack);

  function onClickNext(save: boolean) {
    const newTrack = nextTrack(
      activeTrack,
      activeTrackIndex + nextTrackOffset,
      save
    );
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
          <button onClick={() => onClickNext(false)}>Next Track</button>
          <button onClick={() => onClickNext(true)}>Save Track</button>
        </>
      )}
    </>
  );
}

export default DiscoverTrack;
