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
import { DeckState, deckStateReducer } from "./slice.deck";
import { GlobalUIState, globalUIStateReducer } from "./slice.globalui";

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
  deckState: DeckState;
  globalUIState: GlobalUIState;
}

const store = configureStore({
  reducer: {
    authState: authStateReducer,
    userProfileState: userProfileStateReducer,
    discoverSourceState: discoverSourceStateReducer,
    discoverDestinationState: discoverDestinationStateReducer,
    deckState: deckStateReducer,
    globalUIState: globalUIStateReducer,
  },
});

const dispatch = store.dispatch;

export { store, dispatch, type StoreState, type ResourceStatus };
