import { useEffect, useRef, useState } from "react";
import {
  onAudioElementTimeUpdate,
  registerAudioElement,
  unregisterAudioElement,
} from "../../client/client.audio";
import "../styles/DiscoverDeckItemView.scss";
import { useClickDrag } from "../../utils/hooks";
import { DeckItem } from "../../client/client.model";
import { useDispatch } from "react-redux";
import { changeActiveDeckItem } from "../../state/slice.deck";

const dragActionThreshold = 20; // Drag must be at least 20px in magnitude to dispatch the action.

interface Props {
  deckItemViewIndex: number;
  isActiveDeckItemView: boolean;
  mDeckItem: DeckItem;
  zIndex: number;
  onNext: (deckItemViewIndex: number, currentDeckItem: DeckItem) => void;
  onPrevious: (deckItemViewIndex: number) => void;
}

function DiscoverDeckItemView({
  deckItemViewIndex,
  isActiveDeckItemView,
  mDeckItem,
  zIndex,
  onNext,
  onPrevious,
}: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (isActiveDeckItemView) dispatch(changeActiveDeckItem(mDeckItem));
  }, [isActiveDeckItemView, mDeckItem]);

  const audioRef: React.LegacyRef<HTMLAudioElement> = useRef(null);
  const [isPaused, setIsPaused] = useState(true);

  const onPause = () => setIsPaused(true);
  const onPlay = () => setIsPaused(false);
  const onTimeUpdate = (ev: Event) =>
    onAudioElementTimeUpdate(ev.target as HTMLAudioElement);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("pause", onPause);
      audioRef.current.addEventListener("play", onPlay);
      audioRef.current.addEventListener("timeupdate", onTimeUpdate);
      registerAudioElement(audioRef.current, deckItemViewIndex);
      return () => {
        unregisterAudioElement(deckItemViewIndex);
        audioRef.current?.removeEventListener("pause", onPause);
        audioRef.current?.removeEventListener("play", onPlay);
        audioRef.current?.removeEventListener("timeupdate", onTimeUpdate);
      };
    }
  }, [deckItemViewIndex]);

  const next = () => {
    audioRef.current?.pause();
    onNext(deckItemViewIndex, mDeckItem);
  };
  const previous = () => {
    audioRef.current?.pause();
    onPrevious(deckItemViewIndex);
  };

  const onDragFinish = (dragDelta: { dx: number; dy: number }) => {
    if (isActiveDeckItemView && Math.abs(dragDelta.dy) > dragActionThreshold) {
      if (dragDelta.dy < 0) next();
      else if (dragDelta.dy > 0) previous();
    }
  };

  const [clickDragDelta, endDelta] = useClickDrag(onDragFinish);
  const translationY = isActiveDeckItemView
    ? Math.min(clickDragDelta.dy, 0)
    : 0;
  const positiveNormYDelta =
    Math.max(Math.min(clickDragDelta.dy, 100), 0) / 100; //Clamp between 0-100 then normalize;
  const scale = isActiveDeckItemView ? 1 - 0.2 * positiveNormYDelta : 1;

  const onClickPlayPause = () => {
    if (!isActiveDeckItemView || Math.abs(endDelta.dy) > 1) return; //Hack. End delta lets us know if we were dragging just now.
    audioRef.current?.paused
      ? audioRef.current?.play()
      : audioRef.current?.pause();
  };

  return (
    <div
      className="deck-item"
      style={{
        zIndex: zIndex,
        translate: `0px ${translationY}px`,
        scale: `${scale}`,
      }}
    >
      {mDeckItem === null ? (
        <div>No Valid Track Here</div>
      ) : (
        <>
          <audio
            ref={audioRef}
            id={`audio${deckItemViewIndex}`}
            src={mDeckItem.previewUrl}
          />
          <img className="image" src={mDeckItem.image} />
          <div className="play-pause" onClick={onClickPlayPause}>
            {isActiveDeckItemView && isPaused && (
              <img className="button" src="./src/assets/btn_play.png" />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DiscoverDeckItemView;
