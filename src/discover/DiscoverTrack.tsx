import { useEffect, useMemo, useState } from "react";
import { nextTrack } from "../client/client.deck";
import {
  playNextAudioElement,
  registerAudioElement,
  unregisterAudioElement,
} from "../client/client.audio";
import "./DiscoverTrack.scss";

interface Props {
  isActiveTrack: boolean;
  initialTrackIndex: number;
  nextTrackOffset: number;
  onNextTrack: () => void;
}

function DiscoverTrack({
  isActiveTrack,
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

  useEffect(() => {
    const audioElement = document.getElementById(
      `audio${initialTrackIndex}`
    ) as HTMLAudioElement;
    registerAudioElement(audioElement, initialTrackIndex);
    return () => unregisterAudioElement(initialTrackIndex);
  }, [initialTrackIndex]);

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
    playNextAudioElement(initialTrackIndex);
  }

  return (
    <div className="track" style={{ zIndex: isActiveTrack ? 1 : 0 }}>
      {activeTrack === null ? (
        <div>No Valid Track Here</div>
      ) : (
        <>
          <audio
            id={`audio${initialTrackIndex}`}
            src={activeTrack.previewUrl}
          />
          <img className="image" src={activeTrack.image} />
          <div className="actions">
            <div className="row">
              <img className="image" src={activeTrack.image} />
            </div>
            <div className="row">
              <img className="image" src={activeTrack.image} />
            </div>
            <div className="row">
              <button
                className="padding-1"
                onClick={() => onClickNext(false)}
              >{`${initialTrackIndex}. Next Track (${activeTrackIndex})`}</button>
              <button
                className="padding-1"
                onClick={() => onClickNext(true)}
              >{`${initialTrackIndex}. Save Track (${activeTrackIndex})`}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DiscoverTrack;
