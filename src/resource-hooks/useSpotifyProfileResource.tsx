import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthMode, AuthStatus } from "../state/slice.auth";
import { StoreState, ResourceStatus, dispatch } from "../state/store";
import { getSpotifyProfile } from "../client/client.api";
import { SpotifyUserProfileData } from "../client/client.model";
import {
  loadUserProfileResource,
  injectUserProfileResource,
  errorUserProfileResource,
} from "../state/slice.userprofile";

function useSpotifyProfileResource() {
  const authStatus = useSelector<StoreState, AuthStatus>(
    (state) => state.authState.status
  );
  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
  );
  const resourceStatus = useSelector<StoreState, ResourceStatus>(
    (state) => state.userProfileState.status
  );
  useEffect(() => {
    if (resourceStatus !== "Empty") {
      console.log(
        `Already using User Profile Resource:: Status: ${resourceStatus}`
      );
      return;
    }
    if (authMode !== "Full") {
      console.log(
        `Ignoring request to use User Profile Resource because auth mode is - ${authMode}`
      );
      return;
    }
    loadUserProfile();
  }, [authStatus, authMode]);

  return resourceStatus;
}

function loadUserProfile() {
  dispatch(loadUserProfileResource());

  getSpotifyProfile()
    .then((spotifyProfileData: SpotifyUserProfileData) => {
      console.log(
        `Using Spotify Profile:: Name -- ${spotifyProfileData.display_name}, Email -- ${spotifyProfileData.email}.`
      );
      dispatch(injectUserProfileResource(spotifyProfileData));
    })
    .catch((error) => {
      console.error(error);
      dispatch(errorUserProfileResource());
      console.error("Failed to use Spotify Profile:: Error.");
    });
}

export default useSpotifyProfileResource;
