import { createSlice } from "@reduxjs/toolkit";
import {
  SpotifyUserProfileData,
  emptySpotifyProfileData,
} from "../client/client.model";
import { ResourceStatus } from "./store";

interface UserProfileState {
  status: ResourceStatus;
  data: SpotifyUserProfileData;
}

const defaultUserProfileState: UserProfileState = {
  status: "Empty",
  data: emptySpotifyProfileData,
};

interface InjectAction {
  payload: SpotifyUserProfileData;
  type: string;
}

const userProfileSlice = createSlice({
  name: "userProfileState",
  initialState: defaultUserProfileState,
  reducers: {
    loadUserProfileResource: (state) => {
      state.status = "Loading";
    },
    injectUserProfileResource: (state, action: InjectAction) => {
      state.status = "Loaded";
      state.data = action.payload;
    },
    errorUserProfileResource: (state) => {
      state.status = "Error";
    },
    emptyUserProfileResource: (state) => {
      state.status = "Empty";
      state.data = emptySpotifyProfileData;
    },
  },
});

export const {
  loadUserProfileResource,
  injectUserProfileResource,
  errorUserProfileResource,
  emptyUserProfileResource,
} = userProfileSlice.actions;

export { type UserProfileState };

const userProfileStateReducer = userProfileSlice.reducer;

export { userProfileStateReducer };
