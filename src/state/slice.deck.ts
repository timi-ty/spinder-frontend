import { createSlice } from "@reduxjs/toolkit";
import { DeckItem, emptyDeckItem } from "../client/client.model";

interface DeckState {
  isSourceDeckReady: boolean;
  activeDeckItem: DeckItem;
  activeDeckItemCursor: number;
  deckItem0: DeckItem;
  deckItem1: DeckItem;
  deckItem2: DeckItem;
  destinationDeckSize: number;
}

const defaultDeckState: DeckState = {
  isSourceDeckReady: false,
  activeDeckItemCursor: 0,
  activeDeckItem: emptyDeckItem,
  deckItem0: emptyDeckItem,
  deckItem1: emptyDeckItem,
  deckItem2: emptyDeckItem,
  destinationDeckSize: 0,
};

interface ReadyDeckAction {
  payload: boolean;
  type: string;
}

interface ActiveDeckItemAction {
  payload: number;
  type: string;
}

interface SetDeckItemAction {
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
      state.activeDeckItemCursor = action.payload;
      state.activeDeckItem =
        action.payload === 0
          ? state.deckItem0
          : action.payload === 1
          ? state.deckItem1
          : state.deckItem2;
    },
    setDeckItem0: (state, action: SetDeckItemAction) => {
      state.deckItem0 = action.payload;
    },
    setDeckItem1: (state, action: SetDeckItemAction) => {
      state.deckItem1 = action.payload;
    },
    setDeckItem2: (state, action: SetDeckItemAction) => {
      state.deckItem2 = action.payload;
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
  setDeckItem0,
  setDeckItem1,
  setDeckItem2,
} = deckSlice.actions;

export { type DeckState };

const deckStateReducer = deckSlice.reducer;

export { deckStateReducer };
