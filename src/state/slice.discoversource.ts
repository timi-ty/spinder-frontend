import { createSlice } from "@reduxjs/toolkit";
import {
  DiscoverSourceData,
  emptyDiscoverSourceData,
} from "../client/client.model";
import { ResourceStatus } from "./store";

interface DiscoverSourceState {
  status: ResourceStatus;
  data: DiscoverSourceData;
}

const defaultDiscoverSourceState: DiscoverSourceState = {
  status: "Empty",
  data: emptyDiscoverSourceData,
};

interface InjectAction {
  payload: DiscoverSourceData;
  type: string;
}

const discoverSourceSlice = createSlice({
  name: "discoverSourceState",
  initialState: defaultDiscoverSourceState,
  reducers: {
    loadDiscoverSourceResource: (state) => {
      state.status = "Loading";
    },
    injectDiscoverSourceResource: (state, action: InjectAction) => {
      state.status = "Loaded";
      state.data = action.payload;
    },
    errorDiscoverSourceResource: (state) => {
      state.status = "Error";
    },
    emptyDiscoverSourceResource: (state) => {
      state.status = "Empty";
      state.data = emptyDiscoverSourceData;
    },
  },
});

export const {
  loadDiscoverSourceResource,
  injectDiscoverSourceResource,
  errorDiscoverSourceResource,
  emptyDiscoverSourceResource,
} = discoverSourceSlice.actions;

export { type DiscoverSourceState };

const discoverSourceStateReducer = discoverSourceSlice.reducer;

export { discoverSourceStateReducer };
