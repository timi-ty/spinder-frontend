import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  initializePlayer,
  playTrack,
  pausePlayback,
  setStateChangeCallback,
  isPlayerReady,
  type SpotifyPlaybackState,
} from "../../client/client.spotify-player";
import { onAudioElementTimeUpdate } from "../../client/client.audio";
import styles from "../styles/DiscoverDeckItemView.module.css";
import { DeckItem } from "../../client/client.model";
import { StoreState } from "../../state/store";
import { AuthMode } from "../../state/slice.auth";

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
  const spotifyAccessToken = useSelector<StoreState, string>(
    (state) => state.authState.spotifyAccessToken
  );
  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
  );
  const userProduct = useSelector<StoreState, string>(
    (state) => state.userProfileState.data.product
  );

  // Check if audio is available:
  // - Anonymous users (AcceptedAnon/UnacceptedAnon) always have access (using owner's Premium)
  // - Logged-in users need Premium subscription
  const isAudioAvailable =
    authMode !== "Full" || userProduct === "premium" || userProduct === "";

  const playerInitializedRef = useRef(false);
  const currentTrackUriRef = useRef<string | null>(null);

  // Initialize player when we have a token and audio is available
  useEffect(() => {
    if (!spotifyAccessToken || playerInitializedRef.current || !isAudioAvailable)
      return;

    initializePlayer(spotifyAccessToken)
      .then(() => {
        playerInitializedRef.current = true;
        console.log("Spotify player initialized");
      })
      .catch((error) => {
        console.error("Failed to initialize Spotify player:", error);
      });
  }, [spotifyAccessToken, isAudioAvailable]);

  // Handle playback state changes for progress updates
  const handleStateChange = useCallback(
    (state: SpotifyPlaybackState | null) => {
      if (state && !state.paused) {
        // Create a mock audio element event for the seeker
        const mockAudioElement = {
          currentTime: state.position / 1000,
          duration: state.duration / 1000,
        } as HTMLAudioElement;
        onAudioElementTimeUpdate(mockAudioElement);
      }
    },
    []
  );

  // Set up state change callback
  useEffect(() => {
    setStateChangeCallback(handleStateChange);
    return () => setStateChangeCallback(null);
  }, [handleStateChange]);

  // Handle play/pause
  useEffect(() => {
    if (!isAudioAvailable) return;
    if (!mDeckItem || !mDeckItem.trackUri) return;
    if (!isPlayerReady()) return;

    const playCurrentTrack = async () => {
      try {
        if (isPlaying) {
          // Only play if track changed or we need to start
          if (currentTrackUriRef.current !== mDeckItem.trackUri) {
            await playTrack(mDeckItem.trackUri);
            currentTrackUriRef.current = mDeckItem.trackUri;
          }
        } else {
          await pausePlayback();
        }
      } catch (error) {
        console.error("Playback error:", error);
      }
    };

    playCurrentTrack();
  }, [isPlaying, mDeckItem?.trackUri, isAudioAvailable]);

  // Play new track when deck item changes and we're playing
  useEffect(() => {
    if (!isAudioAvailable) return;
    if (!mDeckItem || !mDeckItem.trackUri || !isPlaying) return;
    if (!isPlayerReady()) return;

    const playNewTrack = async () => {
      if (currentTrackUriRef.current !== mDeckItem.trackUri) {
        try {
          await playTrack(mDeckItem.trackUri);
          currentTrackUriRef.current = mDeckItem.trackUri;
        } catch (error) {
          console.error("Failed to play new track:", error);
        }
      }
    };

    playNewTrack();
  }, [mDeckItem?.trackUri, isAudioAvailable]);

  return (
    <div
      className={styles.deckItem}
      style={{
        translate: `0px ${verticalTranslation}px`,
        transition: `${transitionTranslate ? "translate 0.5s ease" : ""}`,
      }}
    >
      {mDeckItem === null ? (
        <div>No Valid Track Here</div>
      ) : (
        <img
          title={mDeckItem.trackName}
          className={styles.image}
          src={mDeckItem.image}
        />
      )}
    </div>
  );
}

export default DiscoverDeckItemView;
