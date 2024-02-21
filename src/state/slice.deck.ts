import { createSlice } from "@reduxjs/toolkit";

interface DeckState {
  isTracksReady: boolean;
}

const defaultDeckState: DeckState = {
  isTracksReady: false,
};

interface ReadyTracksAction {
  payload: boolean;
  type: string;
}

const deckSlice = createSlice({
  name: "deckState",
  initialState: defaultDeckState,
  reducers: {
    setTracksReady: (state, action: ReadyTracksAction) => {
      state.isTracksReady = action.payload;
    },
  },
});

export const { setTracksReady } = deckSlice.actions;

export { type DeckState };

const deckStateReducer = deckSlice.reducer;

export { deckStateReducer };
