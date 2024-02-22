import { useEffect, useState } from "react";
import {
  onAudioElementTimeUpdate,
  registerAudioElement,
  unregisterAudioElement,
} from "../../client/client.audio";
import "../styles/DiscoverTrack.scss";
import { useClickDrag } from "../../utils/hooks";
import { DeckItem } from "../../client/client.model";

const dragActionThreshold = 20; // Drag must be at least 20px in magnitude to dispatch the action.

interface Props {
  deckItemViewIndex: number;
  isActiveDeckItemView: boolean;
  mTrack: DeckItem;
  onNext: (deckItemViewIndex: number) => void;
  onPrevious: (deckItemViewIndex: number) => void;
}

function DiscoverDeckItemView({
  deckItemViewIndex,
  isActiveDeckItemView,
  mTrack,
  onNext,
  onPrevious,
}: Props) {
  const getAudioElement = () =>
    document.getElementById(`audio${deckItemViewIndex}`) as HTMLAudioElement;
  const [audioElement, setAudioElement] = useState(getAudioElement); //The audio element is likely not available upon initialization of this state. Ensure to get it in useEffect.
  const [isPaused, setIsPaused] = useState(true);

  const onPause = () => setIsPaused(true);
  const onPlay = () => setIsPaused(false);
  const onTimeUpdate = (ev: Event) =>
    onAudioElementTimeUpdate(ev.target as HTMLAudioElement);
  useEffect(() => {
    const audioDomElement = getAudioElement();
    audioDomElement.addEventListener("pause", onPause);
    audioDomElement.addEventListener("play", onPlay);
    audioDomElement.addEventListener("timeupdate", onTimeUpdate);
    setAudioElement(audioDomElement);
    registerAudioElement(audioDomElement, deckItemViewIndex);
    return () => {
      unregisterAudioElement(deckItemViewIndex);
      audioDomElement.removeEventListener("pause", onPause);
      audioDomElement.removeEventListener("play", onPlay);
      audioDomElement.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [deckItemViewIndex]);

  const next = () => {
    audioElement.pause();
    onNext(deckItemViewIndex);
  };
  const previous = () => {
    audioElement.pause();
    onPrevious(deckItemViewIndex);
  };

  const onDragFinish = (dragDelta: { dx: number; dy: number }) => {
    if (isActiveDeckItemView && Math.abs(dragDelta.dy) > dragActionThreshold) {
      console.log(`Dispatching drag finish for ${deckItemViewIndex}`);
      if (dragDelta.dy < 0) next();
      else if (dragDelta.dy > 0) previous();
    }
  };

  const [clickDragDelta, endDelta] = useClickDrag(onDragFinish);
  const translationY = isActiveDeckItemView
    ? Math.min(clickDragDelta.dy, 0)
    : 0;
  const normalizedYDelta = Math.max(Math.min(clickDragDelta.dy, 100), 0) / 100; //Clamp between 0-100 then normalize;
  const scale =
    isActiveDeckItemView && clickDragDelta.dy > 0
      ? 1 - 0.2 * normalizedYDelta
      : 1;

  const onClickPlayPause = () => {
    if (!isActiveDeckItemView || Math.abs(endDelta.dy) > 1) return; //Hack. End delta lets us know if we were dragging just now.
    audioElement.paused ? audioElement.play() : audioElement.pause();
  };

  return (
    <div
      className="track"
      style={{
        zIndex: isActiveDeckItemView ? 1 : 0,
        translate: `0px ${translationY}px`,
        scale: `${scale}`,
      }}
    >
      {mTrack === null ? (
        <div>No Valid Track Here</div>
      ) : (
        <>
          <audio id={`audio${deckItemViewIndex}`} src={mTrack.previewUrl} />
          <img className="image" src={mTrack.image} />
          <div className="play-pause" onClick={onClickPlayPause}>
            {isPaused && (
              <img className="button" src="./src/assets/btn_play.png" />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DiscoverDeckItemView;
