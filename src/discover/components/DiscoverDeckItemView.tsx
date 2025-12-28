import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  initializePlayer,
  playTrack,
  pausePlayback,
  setStateChangeCallback,
  getCurrentPlaybackState,
  enforcePreviewBounds,
  isPlayerReady,
  PREVIEW_START_MS,
  PREVIEW_DURATION_MS,
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

  // Handle playback state changes (for detecting track end, etc.)
  const handleStateChange = useCallback((state: SpotifyPlaybackState | null) => {
    if (state && !state.paused) {
      const previewPosition = Math.max(0, state.position - PREVIEW_START_MS);
      onAudioElementTimeUpdate({
        currentTime: previewPosition / 1000,
        duration: PREVIEW_DURATION_MS / 1000,
      } as HTMLAudioElement);
    }
  }, []);

  // Set up state change callback
  useEffect(() => {
    setStateChangeCallback(handleStateChange);
    return () => setStateChangeCallback(null);
  }, [handleStateChange]);

  // Poll playback state: enforce preview bounds + smooth progress updates
  useEffect(() => {
    if (!isPlaying || !isAudioAvailable || !isPlayerReady()) return;

    const pollInterval = setInterval(async () => {
      const state = await getCurrentPlaybackState();
      if (!state) return;

      // Enforce preview bounds (seek to 45s if before, pause if after 60s)
      await enforcePreviewBounds(state);

      // Update progress bar
      if (!state.paused) {
        const previewPosition = Math.max(0, state.position - PREVIEW_START_MS);
        onAudioElementTimeUpdate({
          currentTime: previewPosition / 1000,
          duration: PREVIEW_DURATION_MS / 1000,
        } as HTMLAudioElement);
      }
    }, 250);

    return () => clearInterval(pollInterval);
  }, [isPlaying, isAudioAvailable]);

  // Handle play/pause - always restart preview from 45s when playing
  useEffect(() => {
    if (!isAudioAvailable) return;
    if (!mDeckItem || !mDeckItem.trackUri) return;
    if (!isPlayerReady()) return;

    if (isPlaying) {
      playTrack(mDeckItem.trackUri).catch((e) => console.error("Playback error:", e));
    } else {
      pausePlayback();
    }
  }, [isPlaying, mDeckItem?.trackUri, isAudioAvailable]);

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
