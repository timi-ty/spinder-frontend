import { useSelector } from "react-redux";
import {
  startRenewingAuthentication,
  stopRenewingAuthentication,
} from "../client/client";
import {
  finalizeLogin,
  getDiscoverDestinations,
  getDiscoverSources,
  getSpotifyProfile,
} from "../client/client.api";
import {
  DiscoverDestinationData,
  DiscoverSourceData,
  SpotifyUserProfileData,
} from "../client/client.model";
import {
  emptyAuthResource,
  errorAuthResource,
  loadAuthResource,
  loginAuthResource,
  setAuthMode,
} from "../state/slice.auth";
import {
  errorDiscoverDestinationResource,
  errorMoreDiscoverDestinationResource,
  injectDiscoverDestinationResource,
  injectMoreDiscoverDestinationResource,
  loadDiscoverDestinationResource,
  loadMoreDiscoverDestinationResource,
} from "../state/slice.discoverdestination";
import {
  errorDiscoverSourceResource,
  injectDiscoverSourceResource,
  loadDiscoverSourceResource,
} from "../state/slice.discoversource";
import {
  loadUserProfileResource,
  injectUserProfileResource,
  errorUserProfileResource,
} from "../state/slice.userprofile";
import { StoreState, dispatch } from "../state/store";

/* Each loader can return an unloader.
 * An unloader is a function that disposes the loaded resources.
 * Most of the time, we want to keep our loaded resources for use in various components in our app.
 * Thus, dispose loaded resources with caution.
 * NOTE: DO NOT USE A LOADER IN AN EFFECT. STRICTLY USE THE USE RESOURCE HOOKS.
 * Loaders may be used in user action callbacks.
 */

function loadAuth(): () => void {
  dispatch(loadAuthResource());

  finalizeLogin()
    .then((userId) => {
      dispatch(loginAuthResource(userId));
      console.log(`Using Authentication for User:: ${userId}`);
    })
    .catch((error) => {
      if (error.status === 401) {
        //Unauthorized is a special error we handle in a way to allow anonymous users.
        dispatch(loadAuthResource());
        dispatch(setAuthMode("UnacceptedAnon"));
        //Call API that can do a partial login. If it succeeds, set auth resource to logged in.
        console.warn(
          "Failed to use full authentication:: Trying anonymous user mode..."
        );
      } else {
        console.error(error);
        dispatch(errorAuthResource());
        console.error("Failed to use Authentication:: Error.");
      }
    });

  // We start here instead of after being logged in to couple this start call to the next stop call.
  // Starting in a callback will make it possible for a stop to be called before any start.
  // This is fine because renew interval is minimum of 1 minute which is more than enough time for authentication to finalize.
  // Even if authentication is not yet ready, renew will simply fail silently. This is virtually impossible at a 55 minute interval though.
  startRenewingAuthentication(55);

  return () => {
    dispatch(emptyAuthResource());
    stopRenewingAuthentication();
  };
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

function loadDiscoverSource() {
  dispatch(loadDiscoverSourceResource());

  getDiscoverSources()
    .then((discoverSourceData: DiscoverSourceData) => {
      console.log(
        `Using Discover Sources:: ${JSON.stringify(discoverSourceData)}.`
      );
      dispatch(injectDiscoverSourceResource(discoverSourceData));
    })
    .catch((error) => {
      console.error(error);
      dispatch(errorDiscoverSourceResource());
      console.error("Failed to use Discover Sources:: Error.");
    });
}

function loadDiscoverDestination() {
  dispatch(loadDiscoverDestinationResource());

  //Load the first page of the resource.
  getDiscoverDestinations(0)
    .then((discoverDestinationData: DiscoverDestinationData) => {
      console.log(
        `Using Discover Destination:: ${JSON.stringify(
          discoverDestinationData
        )}.`
      );
      dispatch(injectDiscoverDestinationResource(discoverDestinationData));
    })
    .catch((error) => {
      console.error(error);
      dispatch(errorDiscoverDestinationResource());
      console.error("Failed to use Discover Destinations:: Error.");
    });
}

function loadMoreDiscoverDestination() {
  dispatch(loadMoreDiscoverDestinationResource());

  //This is a stateful loader. Each time it loads, the resource state knows where the loading stopped.
  const offset = useSelector<StoreState, number>(
    (state) => state.discoverDestinationState.data.offset
  );

  //Load more pages of the resource.
  getDiscoverDestinations(offset)
    .then((discoverDestinationData: DiscoverDestinationData) => {
      console.log(
        `Using Discover Destination:: ${JSON.stringify(
          discoverDestinationData
        )}.`
      );
      dispatch(injectMoreDiscoverDestinationResource(discoverDestinationData));
    })
    .catch((error) => {
      console.error(error);
      dispatch(errorMoreDiscoverDestinationResource());
      console.error("Failed to use more Discover Destinations:: Error.");
    });
}

export {
  loadAuth,
  loadUserProfile,
  loadDiscoverSource,
  loadDiscoverDestination,
  loadMoreDiscoverDestination,
};
