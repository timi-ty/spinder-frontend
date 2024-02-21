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
    loadMoreDiscoverDestinationResource: (state) => {
      state.status = "LoadingMore";
    },
    injectDiscoverDestinationResource: (state, action: InjectAction) => {
      state.status = "Loaded";
      state.data = action.payload;
    },
    injectMoreDiscoverDestinationResource: (state, action: InjectAction) => {
      state.status = "Loaded";
      //Lazy verfication that we are actually adding more data. This can be more sophisticated.
      if (action.payload.offset > state.data.offset)
        state.data.availableDestinations.push(
          ...action.payload.availableDestinations
        );
      state.data.offset = action.payload.offset;
      state.data.selectedDestination = action.payload.selectedDestination;
      state.data.total = action.payload.total;
    },
    errorDiscoverDestinationResource: (state) => {
      state.status = "Error";
    },
    errorMoreDiscoverDestinationResource: (state) => {
      state.status = "ErrorMore";
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
  loadMoreDiscoverDestinationResource,
  injectDiscoverDestinationResource,
  injectMoreDiscoverDestinationResource,
  errorDiscoverDestinationResource,
  errorMoreDiscoverDestinationResource,
  emptyDiscoverDestinationResource,
  selectDiscoverDestination,
} = discoverDestinationSlice.actions;

export { type DiscoverDestinationState };

const discoverDestinationStateReducer = discoverDestinationSlice.reducer;

export { discoverDestinationStateReducer };
