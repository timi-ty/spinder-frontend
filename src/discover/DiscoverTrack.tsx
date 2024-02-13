import { useMemo, useState } from "react";
import { nextTrack } from "../client/client.deck";

interface Props {
  initialTrackIndex: number;
  nextTrackOffset: number;
  onNextTrack: () => void;
}

function DiscoverTrack({
  initialTrackIndex,
  nextTrackOffset,
  onNextTrack,
}: Props) {
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
    onNextTrack();
  }

  return (
    <>
      {activeTrack === null ? (
        <div>No Valid Track Here</div>
      ) : (
        <>
          <audio controls src={activeTrack.previewUrl} />
          <button
            onClick={() => onClickNext(false)}
          >{`${initialTrackIndex}. Next Track (${activeTrackIndex})`}</button>
          <button
            onClick={() => onClickNext(true)}
          >{`${initialTrackIndex}. Save Track (${activeTrackIndex})`}</button>
        </>
      )}
    </>
  );
}

export default DiscoverTrack;
