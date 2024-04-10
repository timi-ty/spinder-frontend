import { createSlice } from "@reduxjs/toolkit";

interface GlobalUIState {
  isSourcePickerOpen: boolean;
  isDestinationPickerOpen: boolean;
  isAttemptingUnauthorizedAction: boolean;
  lastAttemptedUnauthorizedAction: string;
}

const defaultGlobalUIState: GlobalUIState = {
  isSourcePickerOpen: false,
  isDestinationPickerOpen: false,
  isAttemptingUnauthorizedAction: false,
  lastAttemptedUnauthorizedAction: "",
};

interface BooleanAction {
  type: string;
  payload: boolean;
}

interface StringAction {
  type: string;
  payload: string;
}

const globalUISlice = createSlice({
  name: "globalUIState",
  initialState: defaultGlobalUIState,
  reducers: {
    setIsSourcePickerOpen(state, action: BooleanAction) {
      state.isSourcePickerOpen = action.payload;
    },
    setIsDestinationPickerOpen(state, action: BooleanAction) {
      state.isDestinationPickerOpen = action.payload;
    },
    attemptUnauthorizedAction(state, action: StringAction) {
      state.isAttemptingUnauthorizedAction = true;
      state.lastAttemptedUnauthorizedAction = action.payload;
    },
    dissmissUnauthorizedAction(state) {
      state.isAttemptingUnauthorizedAction = false;
    },
  },
});

export const {
  setIsSourcePickerOpen,
  setIsDestinationPickerOpen,
  attemptUnauthorizedAction,
  dissmissUnauthorizedAction,
} = globalUISlice.actions;

export { type GlobalUIState };

const globalUIStateReducer = globalUISlice.reducer;

export { globalUIStateReducer };
