import { createSlice } from "@reduxjs/toolkit";

interface GlobalUIState {
  isPopupShowing: boolean;
  isSourcePickerOpen: boolean;
  isDestinationPickerOpen: boolean;
  isAttemptingUnauthorizedAction: boolean;
  lastAttemptedUnauthorizedAction: string;
}

const defaultGlobalUIState: GlobalUIState = {
  isPopupShowing: false,
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
    setIsPopupShowing(state, action: BooleanAction) {
      state.isPopupShowing = action.payload;
    },
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
  setIsPopupShowing,
  setIsSourcePickerOpen,
  setIsDestinationPickerOpen,
  attemptUnauthorizedAction,
  dissmissUnauthorizedAction,
} = globalUISlice.actions;

export { type GlobalUIState };

const globalUIStateReducer = globalUISlice.reducer;

export { globalUIStateReducer };
