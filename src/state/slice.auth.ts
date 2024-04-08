import { createSlice } from "@reduxjs/toolkit";

type AuthStatus = "Empty" | "Loading" | "LoggedIn" | "LoggedOut" | "Error";
type AuthMode = "Full" | "UnacceptedAnon" | "AcceptedAnon";

interface AuthState {
  mode: AuthMode;
  status: AuthStatus;
  userId: string;
}

const defaultAuthState: AuthState = {
  mode: "Full",
  status: "Empty",
  userId: "",
};

interface LoginAction {
  payload: string; //UserId
  type: string;
}

interface AuthModeAction {
  payload: AuthMode;
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
      state.userId = action.payload;
    },
    logoutAuthResource: (state) => {
      state.status = "LoggedOut";
      state.userId = "";
    },
    errorAuthResource: (state) => {
      state.status = "Error";
      state.userId = "";
    },
    emptyAuthResource: (state) => {
      state.status = "Empty";
      state.userId = "";
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
} = authSlice.actions;

export { type AuthState, type AuthStatus, type AuthMode };

const authStateReducer = authSlice.reducer;

export { authStateReducer };
