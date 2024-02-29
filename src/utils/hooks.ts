import { useCallback, useEffect, useState } from "react";
import {
  startDestinationDeckClient,
  startSourceDeckClient,
  stopDestinationDeckClient,
  stopSourceDeckClient,
} from "../client/client.deck";
import { useDispatch, useSelector } from "react-redux";
import { AuthStatus } from "../state/slice.auth";
import { ResourceStatus, StoreState } from "../state/store";
import {
  loadAuth,
  loadDiscoverDestination,
  loadDiscoverSource,
  loadUserProfile,
} from "./loaders";
import {
  addDestinationDeckItem,
  clearDestinationDeck,
  removeDestinationDeckItem,
  setDeckReady,
} from "../state/slice.deck";
import { DiscoverDestination, DiscoverSource } from "../client/client.model";

/* The global state of this app is managaed by redux. The custom hooks here interface with react-redux hooks.
 * These hooks are built with a homogenous paradigm. They are primarily for loading app data/resources.
 * These hooks will only try to load up a resource from it's source if the resource is not fresh or loading.
 * Every resource has a status value which determines whether or not the resource will be reloaded when hooked up.
 * This means that these hooks can be used anywhere in the app without reloading performance concerns.
 * A resource is only loaded if it is not available or currently loading.
 */
/**********RESOURCE HOOKS START**********/
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
/**********RESOURCE HOOKS END**********/

/**********REGULAR HOOKS START**********/
function useDeck(): boolean {
  const dispatch = useDispatch();
  const userId = useSelector<StoreState, string>(
    (state) => state.authState.userId
  );
  const isDeckReady = useSelector<StoreState, boolean>(
    (state) => state.deckState.isSourceDeckReady
  );

  const sourceResourceStatus = useDiscoverSourceResource();
  const destinationResourceStatus = useDiscoverDestinationResource();

  const selectedSource = useSelector<StoreState, DiscoverSource>(
    (state) => state.discoverSourceState.data.selectedSource
  );
  const selectedDestination = useSelector<StoreState, DiscoverDestination>(
    (state) => state.discoverDestinationState.data.selectedDestination
  );

  const canStartSourceDeckClient =
    sourceResourceStatus === "Loaded" || sourceResourceStatus === "LoadingMore"; //Can only start the source deck client after we know our selected source.

  useEffect(() => {
    if (!canStartSourceDeckClient) return;
    startSourceDeckClient(
      userId,
      selectedSource,
      () => {
        dispatch(setDeckReady(true));
      },
      () => {
        dispatch(setDeckReady(false));
      }
    );
    return () => {
      stopSourceDeckClient();
    };
  }, [userId, canStartSourceDeckClient, selectedSource.id]); //If the id doesn't change, it is the same source.

  const canStartDestinationDeckClient =
    destinationResourceStatus === "Loaded" ||
    destinationResourceStatus === "LoadingMore"; //Can only start the source deck client after we know our selected destination.

  useEffect(() => {
    if (!canStartDestinationDeckClient) return;
    startDestinationDeckClient(
      userId,
      selectedDestination,
      () => {
        dispatch(addDestinationDeckItem());
      },
      () => {
        dispatch(removeDestinationDeckItem());
      },
      () => {
        dispatch(clearDestinationDeck());
      }
    );
    return () => {
      stopDestinationDeckClient();
    };
  }, [userId, canStartDestinationDeckClient, selectedDestination.id]); //If the id doesn't change, it is the same destination.

  return isDeckReady;
}

function useClickDrag(
  onFinish: (clickDragDelta: { dx: number; dy: number }) => void
) {
  const [clickDragDelta, setClickDragDelta] = useState({ dx: 0, dy: 0 });
  const [endDelta, setEndDelta] = useState({ dx: 0, dy: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mouseStartPos, setMouseStartPos] = useState({ x: 0, y: 0 });
  const [mouseCurrentPos, setMouseCurrentPos] = useState({ x: 0, y: 0 });
  const onMouseDown = useCallback((ev: MouseEvent) => {
    setMouseStartPos({ x: ev.clientX, y: ev.clientY });
    setIsDragging(true);
  }, []);
  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    setClickDragDelta({ dx: 0, dy: 0 });
  }, []);
  const onMouseMove = useCallback((ev: MouseEvent) => {
    setMouseCurrentPos({ x: ev.clientX, y: ev.clientY });
  }, []);
  useEffect(() => {
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);
  useEffect(() => {
    if (!isDragging) return;

    const deltaX = mouseCurrentPos.x - mouseStartPos.x;
    const deltaY = mouseCurrentPos.y - mouseStartPos.y;
    setClickDragDelta({ dx: deltaX, dy: deltaY });
    setEndDelta(clickDragDelta);

    return () => {
      setClickDragDelta({ dx: 0, dy: 0 });
      setEndDelta({ dx: 0, dy: 0 });
    };
  }, [mouseStartPos, mouseCurrentPos, isDragging]);

  //Last effect that is called after drag is finished. onFinish is guaranteed to be called last after a drag action.
  useEffect(() => {
    if (!isDragging) {
      if (Math.abs(endDelta.dx) > 0 || Math.abs(endDelta.dy) > 0)
        onFinish(endDelta);
    }
  }, [endDelta, isDragging]);

  return [clickDragDelta, endDelta];
}
/**********REGULAR HOOKS END**********/

export {
  useAuthResource,
  useSpotifyProfileResource,
  useDiscoverSourceResource,
  useDiscoverDestinationResource,
  useDeck,
  useClickDrag,
};
