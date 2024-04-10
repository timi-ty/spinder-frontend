import { createSlice } from "@reduxjs/toolkit";
import { ResourceStatus } from "./store";
import {
  DiscoverDestination,
  DiscoverDestinationData,
  emptyDiscoverDestinationData,
} from "../client/client.model";

interface DiscoverDestinationState {
  status: ResourceStatus;
  data: DiscoverDestinationData;
}

const defaultDiscoverDestinationState: DiscoverDestinationState = {
  status: "Empty",
  data: emptyDiscoverDestinationData,
};

interface InjectAction {
  payload: DiscoverDestinationData;
  type: string;
}

interface SelectDestinationAction {
  payload: DiscoverDestination;
  type: string;
}

const discoverDestinationSlice = createSlice({
  name: "discoverDestinationState",
  initialState: defaultDiscoverDestinationState,
  reducers: {
    loadDiscoverDestinationResource: (state) => {
      state.status = "Loading";
    },
    injectDiscoverDestinationResource: (state, action: InjectAction) => {
      state.status = "Loaded";
      state.data = action.payload;
    },
    errorDiscoverDestinationResource: (state) => {
      state.status = "Error";
    },
    emptyDiscoverDestinationResource: (state) => {
      state.status = "Empty";
      state.data = emptyDiscoverDestinationData;
    },
    selectDiscoverDestination: (state, action: SelectDestinationAction) => {
      state.data.selectedDestination = action.payload;
    },
  },
});

export const {
  loadDiscoverDestinationResource,
  injectDiscoverDestinationResource,
  errorDiscoverDestinationResource,
  emptyDiscoverDestinationResource,
  selectDiscoverDestination,
} = discoverDestinationSlice.actions;

export { type DiscoverDestinationState };

const discoverDestinationStateReducer = discoverDestinationSlice.reducer;

export { discoverDestinationStateReducer };
