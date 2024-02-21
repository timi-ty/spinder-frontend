import { configureStore } from "@reduxjs/toolkit";
import { AuthState, authStateReducer } from "./slice.auth";
import { UserProfileState, userProfileStateReducer } from "./slice.userprofile";
import {
  DiscoverSourceState,
  discoverSourceStateReducer,
} from "./slice.discoversource";
import {
  DiscoverDestinationState,
  discoverDestinationStateReducer,
} from "./slice.discoverdestination";

type ResourceStatus =
  | "Empty"
  | "Loading"
  | "LoadingMore"
  | "Loaded"
  | "Error"
  | "ErrorMore";

interface StoreState {
  authState: AuthState;
  userProfileState: UserProfileState;
  discoverSourceState: DiscoverSourceState;
  discoverDestinationState: DiscoverDestinationState;
}

const store = configureStore({
  reducer: {
    authState: authStateReducer,
    userProfileState: userProfileStateReducer,
    discoverSourceState: discoverSourceStateReducer,
    discoverDestinationState: discoverDestinationStateReducer,
  },
});

const dispatch = store.dispatch;

export { store, dispatch, type StoreState, type ResourceStatus };
