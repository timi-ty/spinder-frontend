import { useEffect, useRef } from "react";
import { onAudioElementTimeUpdate } from "../../client/client.audio";
import "../styles/DiscoverDeckItemView.scss";
import { DeckItem } from "../../client/client.model";

interface Props {
  deckItemViewIndex: number;
  mDeckItem: DeckItem;
  verticalTranslation: number;
  isPlaying: boolean;
  transitionTranslate: boolean;
}

function DiscoverDeckItemView({
  deckItemViewIndex,
  mDeckItem,
  verticalTranslation,
  isPlaying,
  transitionTranslate,
}: Props) {
  const audioRef: React.LegacyRef<HTMLAudioElement> = useRef(null);

  const onTimeUpdate = (ev: Event) =>
    onAudioElementTimeUpdate(ev.target as HTMLAudioElement);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.addEventListener("timeupdate", onTimeUpdate);
      return () => {
        audioRef.current?.removeEventListener("timeupdate", onTimeUpdate);
      };
    }
  }, [deckItemViewIndex]);

  useEffect(() => {
    isPlaying ? audioRef.current?.play() : audioRef.current?.pause();
  }, [isPlaying]);

  return (
    <div
      className="deck-item"
      style={{
        translate: `0px ${verticalTranslation}px`,
        transition: `${transitionTranslate ? "translate 0.5s ease" : ""}`,
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
          <img
            title={mDeckItem.trackName}
            className="image"
            src={mDeckItem.image}
          />
        </>
      )}
    </div>
  );
}

export default DiscoverDeckItemView;
