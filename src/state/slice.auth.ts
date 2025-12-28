import { createSlice } from "@reduxjs/toolkit";

type AuthStatus = "Empty" | "Loading" | "LoggedIn" | "LoggedOut" | "Error";
type AuthMode = "Full" | "UnacceptedAnon" | "AcceptedAnon";

interface AuthState {
  mode: AuthMode;
  status: AuthStatus;
  userId: string;
  spotifyAccessToken: string;
}

const defaultAuthState: AuthState = {
  mode: "Full",
  status: "Empty",
  userId: "",
  spotifyAccessToken: "",
};

interface LoginAction {
  payload: { userId: string; spotifyAccessToken: string };
  type: string;
}

interface AuthModeAction {
  payload: AuthMode;
  type: string;
}

interface SetSpotifyTokenAction {
  payload: string;
  type: string;
}

const authSlice = createSlice({
  name: "authState",
  initialState: defaultAuthState,
  reducers: {
    setAuthMode: (state, action: AuthModeAction) => {
      state.mode = action.payload;
    },
    loadAuthResource: (state) => {
      state.status = "Loading";
      state.userId = "";
    },
    loginAuthResource: (state, action: LoginAction) => {
      state.status = "LoggedIn";
      state.userId = action.payload.userId;
      state.spotifyAccessToken = action.payload.spotifyAccessToken;
    },
    logoutAuthResource: (state) => {
      state.status = "LoggedOut";
      state.userId = "";
      state.spotifyAccessToken = "";
    },
    errorAuthResource: (state) => {
      state.status = "Error";
      state.userId = "";
    },
    emptyAuthResource: (state) => {
      state.status = "Empty";
      state.userId = "";
    },
    setSpotifyAccessToken: (state, action: SetSpotifyTokenAction) => {
      state.spotifyAccessToken = action.payload;
    },
  },
});

export const {
  setAuthMode,
  loadAuthResource,
  loginAuthResource,
  logoutAuthResource,
  errorAuthResource,
  emptyAuthResource,
  setSpotifyAccessToken,
} = authSlice.actions;

export { type AuthState, type AuthStatus, type AuthMode };

const authStateReducer = authSlice.reducer;

export { authStateReducer };
