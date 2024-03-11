import { createSlice } from "@reduxjs/toolkit";

interface GlobalUIState {
  isAwaitingFullScreen: boolean;
  isTopToastVisible: boolean;
  isBottomToastVisible: boolean;
  topToastMessage: string;
  bottomToastMessage: string;
}

const defaultGlobalUIState: GlobalUIState = {
  isAwaitingFullScreen: false,
  isTopToastVisible: false,
  isBottomToastVisible: false,
  topToastMessage: "",
  bottomToastMessage: "",
};

interface ToastAction {
  type: string;
  payload: string;
}

interface FullScreenAction {
  type: string;
  payload: boolean;
}

const globalUISlice = createSlice({
  name: "globalUIState",
  initialState: defaultGlobalUIState,
  reducers: {
    setIsAwaitingFullScreen(state, action: FullScreenAction) {
      state.isAwaitingFullScreen = action.payload;
    },
    showTopToast: (state, action: ToastAction) => {
      state.isTopToastVisible = true;
      state.topToastMessage = action.payload;
    },
    showBottomToast: (state, action: ToastAction) => {
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
} = globalUISlice.actions;

export { type GlobalUIState };

const globalUIStateReducer = globalUISlice.reducer;

export { globalUIStateReducer };
