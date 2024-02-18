import { createSlice } from "@reduxjs/toolkit";

type AuthStatus = "Empty" | "Loading" | "LoggedIn" | "LoggedOut" | "Error";

interface AuthState {
  status: AuthStatus;
  userId: string;
}

const defaultAuthState: AuthState = {
  status: "Empty",
  userId: "",
};

interface LoginAction {
  payload: string; //UserId
  type: string;
}

const authSlice = createSlice({
  name: "authState",
  initialState: defaultAuthState,
  reducers: {
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
  loadAuthResource,
  loginAuthResource,
  logoutAuthResource,
  errorAuthResource,
  emptyAuthResource,
} = authSlice.actions;

export { type AuthState, type AuthStatus };

const authStateReducer = authSlice.reducer;

export { authStateReducer };
