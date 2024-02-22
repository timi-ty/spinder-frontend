import { createSlice } from "@reduxjs/toolkit";

interface DeckState {
  isDeckReady: boolean;
}

const defaultDeckState: DeckState = {
  isDeckReady: false,
};

interface ReadyTracksAction {
  payload: boolean;
  type: string;
}

const deckSlice = createSlice({
  name: "deckState",
  initialState: defaultDeckState,
  reducers: {
    setDeckReady: (state, action: ReadyTracksAction) => {
      state.isDeckReady = action.payload;
    },
  },
});

export const { setDeckReady } = deckSlice.actions;

export { type DeckState };

const deckStateReducer = deckSlice.reducer;

export { deckStateReducer };
