import { useEffect, useRef } from "react";
import {
  onAudioElementTimeUpdate,
  registerAudioElement,
  unregisterAudioElement,
} from "../../client/client.audio";
import "../styles/DiscoverDeckItemView.scss";
import { DeckItem } from "../../client/client.model";

interface Props {
  deckItemViewIndex: number;
  isActiveDeckItemView: boolean;
  mDeckItem: DeckItem;
  zIndex: number;
  clickDragDelta: { dx: number; dy: number };
  isPlaying: boolean;
}

function DiscoverDeckItemView({
  deckItemViewIndex,
  isActiveDeckItemView,
  mDeckItem,
  zIndex,
  clickDragDelta,
  isPlaying,
}: Props) {
  const audioRef: React.LegacyRef<HTMLAudioElement> = useRef(null);

  const onTimeUpdate = (ev: Event) =>
    onAudioElementTimeUpdate(ev.target as HTMLAudioElement);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.addEventListener("timeupdate", onTimeUpdate);
      registerAudioElement(audioRef.current, deckItemViewIndex);
      return () => {
        unregisterAudioElement(deckItemViewIndex);
        audioRef.current?.removeEventListener("timeupdate", onTimeUpdate);
      };
    }
  }, [deckItemViewIndex]);

  useEffect(() => {
    isPlaying ? audioRef.current?.play() : audioRef.current?.pause();
  }, [isPlaying]);

  const translationY = isActiveDeckItemView
    ? Math.min(clickDragDelta.dy, 0)
    : 0;
  const positiveNormYDelta =
    Math.max(Math.min(clickDragDelta.dy, 100), 0) / 100; //Clamp between 0-100 then normalize;
  const scale = isActiveDeckItemView ? 1 - 0.2 * positiveNormYDelta : 1;

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
        </>
      )}
    </div>
  );
}

export default DiscoverDeckItemView;
