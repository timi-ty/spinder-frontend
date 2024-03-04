import { createSlice } from "@reduxjs/toolkit";

interface ToastState {
  isTopToastVisible: boolean;
  isBottomToastVisible: boolean;
  topToastMessage: string;
  bottomToastMessage: string;
}

const defaultToastState: ToastState = {
  isTopToastVisible: false,
  isBottomToastVisible: false,
  topToastMessage: "",
  bottomToastMessage: "",
};

interface ToastAction {
  type: string;
  payload: string;
}

const toastSlice = createSlice({
  name: "toastState",
  initialState: defaultToastState,
  reducers: {
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

export const { showBottomToast, showTopToast, hideBottomToast, hideTopToast } =
  toastSlice.actions;

export { type ToastState };

const toastStateReducer = toastSlice.reducer;

export { toastStateReducer };
