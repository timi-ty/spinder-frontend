import { createSlice } from "@reduxjs/toolkit";

interface GlobalUIState {
  isAwaitingFullScreen: boolean;
  isSourcePickerOpen: boolean;
  isDestinationPickerOpen: boolean;
  isTopToastVisible: boolean;
  isBottomToastVisible: boolean;
  topToastMessage: string;
  bottomToastMessage: string;
}

const defaultGlobalUIState: GlobalUIState = {
  isAwaitingFullScreen: false,
  isSourcePickerOpen: false,
  isDestinationPickerOpen: false,
  isTopToastVisible: false,
  isBottomToastVisible: false,
  topToastMessage: "",
  bottomToastMessage: "",
};

interface StringAction {
  type: string;
  payload: string;
}

interface BooleanAction {
  type: string;
  payload: boolean;
}

const globalUISlice = createSlice({
  name: "globalUIState",
  initialState: defaultGlobalUIState,
  reducers: {
    setIsAwaitingFullScreen(state, action: BooleanAction) {
      state.isAwaitingFullScreen = action.payload;
    },
    setIsSourcePickerOpen(state, action: BooleanAction) {
      state.isSourcePickerOpen = action.payload;
    },
    setIsDestinationPickerOpen(state, action: BooleanAction) {
      state.isDestinationPickerOpen = action.payload;
    },
    showTopToast: (state, action: StringAction) => {
      state.isTopToastVisible = true;
      state.topToastMessage = action.payload;
    },
    showBottomToast: (state, action: StringAction) => {
      state.isBottomToastVisible = true;
      state.bottomToastMessage = action.payload;
    },
    hideTopToast: (state) => {
      state.isTopToastVisible = false;
    },
    hideBottomToast: (state) => {
      state.isBottomToastVisible = false;
    },
  },
});

export const {
  showBottomToast,
  showTopToast,
  hideBottomToast,
  hideTopToast,
  setIsAwaitingFullScreen,
  setIsSourcePickerOpen,
  setIsDestinationPickerOpen,
} = globalUISlice.actions;

export { type GlobalUIState };

const globalUIStateReducer = globalUISlice.reducer;

export { globalUIStateReducer };
