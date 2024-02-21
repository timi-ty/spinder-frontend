import { useEffect } from "react";
import { startDeckClient, stopDeckClient } from "../client/client.deck";
import { useDispatch, useSelector } from "react-redux";
import { AuthStatus } from "../state/slice.auth";
import { ResourceStatus, StoreState } from "../state/store";
import {
  loadAuth,
  loadDiscoverDestination,
  loadDiscoverSource,
  loadUserProfile,
} from "./loaders";
import { setTracksReady } from "../state/slice.deck";

/* The global state of this app is managaed by redux. The custom hooks here interface with react-redux hooks.
 * These hooks are built with a homogenous paradigm. They are primarily for loading app data/resources.
 * These hooks will only try to load up a resource from it's source if the resource is not fresh or loading.
 * Every resource has a status value which determines whether or not the resource will be reloaded when hooked up.
 * This means that these hooks can be used anywhere in the app without reloading performance concerns.
 * A resource is only loaded if it is not available or currently loading.
 */

function useAuthResource() {
  const authStatus = useSelector<StoreState, AuthStatus>(
    (state) => state.authState.status
  );
  useEffect(() => {
    if (authStatus !== "Empty") {
      console.log(`Already using Auth Resource:: Status: ${authStatus}`);
      return;
    }
    const unloader = loadAuth();
    return unloader;
  }, []);

  return authStatus;
}

function useSpotifyProfileResource() {
  const authStatus = useSelector<StoreState, AuthStatus>(
    (state) => state.authState.status
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
    loadUserProfile();
    return () => {
      console.log("Unload User Profile");
    };
  }, [authStatus]);

  return resourceStatus;
}

function useDiscoverSourceResource() {
  const authStatus = useSelector<StoreState, AuthStatus>(
    (state) => state.authState.status
  );
  const resourceStatus = useSelector<StoreState, ResourceStatus>(
    (state) => state.discoverSourceState.status
  );
  useEffect(() => {
    if (resourceStatus !== "Empty") {
      console.log(
        `Aready using Discover Source Resource:: Status: ${resourceStatus}`
      );
      return;
    }
    loadDiscoverSource();
  }, [authStatus]);

  return resourceStatus;
}

function useDiscoverDestinationResource() {
  const authStatus = useSelector<StoreState, AuthStatus>(
    (state) => state.authState.status
  );
  const resourceStatus = useSelector<StoreState, ResourceStatus>(
    (state) => state.discoverDestinationState.status
  );
  useEffect(() => {
    if (resourceStatus !== "Empty") {
      console.log(
        `Already using Discover Destination Resource:: Status: ${resourceStatus}`
      );
      return;
    }
    loadDiscoverDestination();
  }, [authStatus]);

  return resourceStatus;
}

//This hook is not managed by redux.
function useReadyTracks(): boolean {
  const dispatch = useDispatch();
  const userId = useSelector<StoreState, string>(
    (state) => state.authState.userId
  );
  const isTracksReady = useSelector<StoreState, boolean>(
    (state) => state.deckState.isTracksReady
  );
  useEffect(() => {
    startDeckClient(
      userId,
      () => {
        dispatch(setTracksReady(true));
      },
      () => {
        dispatch(setTracksReady(false));
      }
    );
    return () => {
      stopDeckClient();
    };
  }, [userId]);

  return isTracksReady;
}

export {
  useAuthResource,
  useSpotifyProfileResource,
  useDiscoverSourceResource,
  useDiscoverDestinationResource,
  useReadyTracks,
};
