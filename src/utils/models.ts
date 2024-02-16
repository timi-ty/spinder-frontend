interface AuthenticationState {
  state: "Pending" | "LoggedIn" | "LoggedOut";
  userId: string;
}

const defaultAuthState: AuthenticationState = {
  state: "Pending",
  userId: "",
};

type PickerState = "Picking" | "Picked" | "Loading";

export { type AuthenticationState, defaultAuthState, type PickerState };
