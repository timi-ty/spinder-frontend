import { useCallback, useEffect, useState } from "react";
import { nextTrack } from "../client/client.deck";
import {
  onAudioElementTimeUpdate,
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
  const getFirstTrack = useCallback(
    () => nextTrack(null, initialTrackIndex, false),
    [initialTrackIndex]
  );
  const getAudioElement = useCallback(
    () =>
      document.getElementById(`audio${initialTrackIndex}`) as HTMLAudioElement,
    [initialTrackIndex]
  );
  const [activeTrackIndex, setActiveTrackIndex] = useState(initialTrackIndex);
  const [activeTrack, setActiveTrack] = useState(getFirstTrack);
  const [audioElement, setAudioElement] = useState(getAudioElement); //The audio element is likely not available upon initialization of this state. Ensure to get it in useEffect.
  const [isPaused, setIsPaused] = useState(true);
  const onPause = useCallback(() => setIsPaused(true), []);
  const onPlay = useCallback(() => setIsPaused(false), []);
  const onTimeUpdate = useCallback(
    (ev: Event) => onAudioElementTimeUpdate(ev.target as HTMLAudioElement),
    []
  );

  useEffect(() => {
    const audioDomElement = getAudioElement();
    audioDomElement.addEventListener("pause", onPause);
    audioDomElement.addEventListener("play", onPlay);
    audioDomElement.addEventListener("timeupdate", onTimeUpdate);
    setAudioElement(audioDomElement);
    registerAudioElement(audioDomElement, initialTrackIndex);
    return () => {
      unregisterAudioElement(initialTrackIndex);
      audioDomElement.removeEventListener("pause", onPause);
      audioDomElement.removeEventListener("play", onPlay);
      audioDomElement.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [initialTrackIndex]);

  const onClickNext = useCallback(
    (save: boolean) => {
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
    },
    [activeTrack, activeTrackIndex, nextTrackOffset, initialTrackIndex]
  );

  const onClickPlayPause = useCallback(() => {
    audioElement.paused ? audioElement.play() : audioElement.pause();
  }, [audioElement]);

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
          <div className="play-pause" onClick={onClickPlayPause}>
            {isPaused && (
              <img className="button" src="./src/assets/btn_play.png" />
            )}
          </div>
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
