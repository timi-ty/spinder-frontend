interface AuthenticationState {
  state: "Pending" | "LoggedIn" | "LoggedOut";
  userId: string;
}

const defaultAuthState: AuthenticationState = {
  state: "Pending",
  userId: "",
};

export { type AuthenticationState, defaultAuthState };
