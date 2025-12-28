// Spotify Web Playback SDK Types
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
    };
  }
}

interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (callback: (token: string) => void) => void;
  volume?: number;
}

interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  togglePlay(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  seek(position_ms: number): Promise<void>;
  getCurrentState(): Promise<SpotifyPlaybackState | null>;
  setVolume(volume: number): Promise<void>;
  addListener(
    event: "ready",
    callback: (state: { device_id: string }) => void
  ): void;
  addListener(event: "not_ready", callback: () => void): void;
  addListener(
    event: "player_state_changed",
    callback: (state: SpotifyPlaybackState | null) => void
  ): void;
  addListener(
    event: "initialization_error" | "authentication_error" | "account_error",
    callback: (error: { message: string }) => void
  ): void;
  removeListener(event: string): void;
}

interface SpotifyPlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      uri: string;
      name: string;
      album: { images: { url: string }[] };
      artists: { name: string }[];
    };
  };
}

// Player state
let player: SpotifyPlayer | null = null;
let deviceId: string | null = null;
let currentAccessToken: string | null = null;
let isInitialized = false;
let initPromise: Promise<string> | null = null;
let stateChangeCallback: ((state: SpotifyPlaybackState | null) => void) | null =
  null;

function initializePlayer(accessToken: string): Promise<string> {
  // Return existing promise if initialization is in progress
  if (initPromise) {
    return initPromise;
  }

  // Return immediately if already initialized with same token
  if (isInitialized && deviceId && currentAccessToken === accessToken) {
    return Promise.resolve(deviceId);
  }

  currentAccessToken = accessToken;

  initPromise = new Promise((resolve, reject) => {
    const initPlayer = () => {
      player = new window.Spotify.Player({
        name: "Spindr",
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Spotify Player ready with Device ID:", device_id);
        deviceId = device_id;
        isInitialized = true;
        initPromise = null;
        resolve(device_id);
      });

      player.addListener("not_ready", () => {
        console.log("Spotify Player device has gone offline");
        isInitialized = false;
        initPromise = null;
        reject(new Error("Device not ready"));
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error("Spotify Player initialization error:", message);
        initPromise = null;
        reject(new Error(message));
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("Spotify Player authentication error:", message);
        initPromise = null;
        reject(new Error(message));
      });

      player.addListener("account_error", ({ message }) => {
        console.error("Spotify Player account error:", message);
        initPromise = null;
        reject(new Error(message));
      });

      player.addListener("player_state_changed", (state) => {
        if (stateChangeCallback) {
          stateChangeCallback(state);
        }
      });

      player.connect();
    };

    // Check if SDK is already loaded
    if (window.Spotify) {
      initPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
    }
  });

  return initPromise;
}

async function playTrack(trackUri: string): Promise<void> {
  if (!deviceId || !currentAccessToken) {
    throw new Error("Player not initialized");
  }

  const response = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: [trackUri] }),
    }
  );

  if (!response.ok && response.status !== 204) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || "Failed to play track");
  }
}

async function pausePlayback(): Promise<void> {
  if (player) {
    await player.pause();
  }
}

async function resumePlayback(): Promise<void> {
  if (player) {
    await player.resume();
  }
}

async function seekTo(positionMs: number): Promise<void> {
  if (player) {
    await player.seek(positionMs);
  }
}

async function setVolume(volume: number): Promise<void> {
  if (player) {
    await player.setVolume(Math.max(0, Math.min(1, volume)));
  }
}

function setStateChangeCallback(
  callback: ((state: SpotifyPlaybackState | null) => void) | null
): void {
  stateChangeCallback = callback;
}

async function getCurrentPlaybackState(): Promise<SpotifyPlaybackState | null> {
  if (player) {
    return player.getCurrentState();
  }
  return null;
}

function disconnectPlayer(): void {
  if (player) {
    player.disconnect();
    player = null;
    deviceId = null;
    isInitialized = false;
    initPromise = null;
    currentAccessToken = null;
  }
}

function isPlayerReady(): boolean {
  return isInitialized && deviceId !== null;
}

export {
  initializePlayer,
  playTrack,
  pausePlayback,
  resumePlayback,
  seekTo,
  setVolume,
  setStateChangeCallback,
  getCurrentPlaybackState,
  disconnectPlayer,
  isPlayerReady,
  type SpotifyPlaybackState,
};

