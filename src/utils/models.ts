interface AuthenticationState {
  state: "Pending" | "LoggedIn" | "LoggedOut";
  token: string;
  userId: string;
}

const defaultAuthState: AuthenticationState = {
  state: "Pending",
  token: "",
  userId: "",
};

export { type AuthenticationState, defaultAuthState };
