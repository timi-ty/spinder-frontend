import { createSlice } from "@reduxjs/toolkit";
import { DeckItem, emptyDeckItem } from "../client/client.model";

interface DeckState {
  isDeckReady: boolean;
  activeDeckItem: DeckItem;
}

const defaultDeckState: DeckState = {
  isDeckReady: false,
  activeDeckItem: emptyDeckItem,
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
      state.isDeckReady = action.payload;
    },
    changeActiveDeckItem: (state, action: ActiveDeckItemAction) => {
      state.activeDeckItem = action.payload;
    },
  },
});

export const { setDeckReady, changeActiveDeckItem } = deckSlice.actions;

export { type DeckState };

const deckStateReducer = deckSlice.reducer;

export { deckStateReducer };
