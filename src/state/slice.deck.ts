import { createSlice } from "@reduxjs/toolkit";
import { DeckItem, emptyDeckItem } from "../client/client.model";

interface DeckState {
  isSourceDeckReady: boolean;
  activeDeckItem: DeckItem;
  destinationDeckSize: number;
}

const defaultDeckState: DeckState = {
  isSourceDeckReady: false,
  activeDeckItem: emptyDeckItem,
  destinationDeckSize: 0,
};

interface ReadyDeckAction {
  payload: boolean;
  type: string;
}

interface ActiveDeckItemAction {
  payload: DeckItem;
  type: string;
}

const deckSlice = createSlice({
  name: "deckState",
  initialState: defaultDeckState,
  reducers: {
    setDeckReady: (state, action: ReadyDeckAction) => {
      state.isSourceDeckReady = action.payload;
    },
    changeActiveDeckItem: (state, action: ActiveDeckItemAction) => {
      state.activeDeckItem = action.payload;
    },
    addDestinationDeckItem: (state) => {
      state.destinationDeckSize += 1;
    },
    removeDestinationDeckItem: (state) => {
      state.destinationDeckSize -= 1;
      if (state.destinationDeckSize < 0) state.destinationDeckSize = 0;
    },
    clearDestinationDeck: (state) => {
      state.destinationDeckSize = 0;
    },
  },
});

export const {
  setDeckReady,
  changeActiveDeckItem,
  addDestinationDeckItem,
  removeDestinationDeckItem,
  clearDestinationDeck,
} = deckSlice.actions;

export { type DeckState };

const deckStateReducer = deckSlice.reducer;

export { deckStateReducer };
