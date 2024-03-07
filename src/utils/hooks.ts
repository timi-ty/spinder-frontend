import { useCallback, useEffect, useRef, useState } from "react";
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
    const unloadAuth = loadAuth();
    //It is important to do this because loading auth also starts renewing authentication. We have to unload and thus top renewing the authentication when the effect is disposed.
    return () => unloadAuth();
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

  useEffect(() => {
    startSourceDeckClient(
      userId,
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
  }, [userId]);

  useEffect(() => {
    startDestinationDeckClient(
      userId,
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
  }, [userId]);

  return isDeckReady;
}

//Emits onClick if the drag threshold was not reached, else emits onDragFInish
function useClickDrag(
  container: HTMLElement,
  dragThreshold: { absY: number; absX: number },
  onStartGesture: () => void,
  onDragFinish: (clickDragDelta: { dx: number; dy: number }) => void,
  onClick: () => void
) {
  const clickDragDeltaRef = useRef({ dx: 0, dy: 0 });
  const [clickDragDelta, setClickDragDelta] = useState({ dx: 0, dy: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mouseStartPos, setMouseStartPos] = useState({ x: 0, y: 0 });
  const [mouseCurrentPos, setMouseCurrentPos] = useState({ x: 0, y: 0 });

  //Don't try to read state from any of these mouse callbacks. They closure the state and we don't want to repeatedly detach and attach the callbacks to keep the closure up to date.
  const onMouseDown = useCallback((ev: MouseEvent) => {
    setMouseStartPos({ x: ev.clientX, y: ev.clientY });
    setIsDragging(true);
    onStartGesture();
  }, []);
  const onMouseUpWindow = useCallback(() => {
    setIsDragging(false);
    if (
      Math.abs(clickDragDeltaRef.current.dx) > dragThreshold.absY ||
      Math.abs(clickDragDeltaRef.current.dy) > dragThreshold.absX
    ) {
      onDragFinish(clickDragDeltaRef.current);
      setClickDragDelta({ dx: 0, dy: 0 }); //Only reset if you handled the gesture.
      clickDragDeltaRef.current = { dx: 0, dy: 0 };
    }
  }, [onDragFinish, onClick]);
  const onMouseUpContainer = useCallback(() => {
    if (
      Math.abs(clickDragDeltaRef.current.dx) < dragThreshold.absY &&
      Math.abs(clickDragDeltaRef.current.dy) < dragThreshold.absX
    ) {
      onClick();
      setClickDragDelta({ dx: 0, dy: 0 }); //Only reset if you handled the gesture.
      clickDragDeltaRef.current = { dx: 0, dy: 0 };
    }
  }, [onDragFinish, onClick]);
  const onMouseMove = useCallback((ev: MouseEvent) => {
    setMouseCurrentPos({ x: ev.clientX, y: ev.clientY });
  }, []);
  useEffect(() => {
    container.addEventListener("mousedown", onMouseDown); //Action can only start from the container
    container.addEventListener("mouseup", onMouseUpContainer); //The click action is only dispatched when it is executed from within the container.
    window.addEventListener("mouseup", onMouseUpWindow); //We use window because no element should block finishing the click drag by releasing the mouse.
    window.addEventListener("mousemove", onMouseMove); //We use window because no element should block dragging once it has started.

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseup", onMouseUpContainer);
      window.removeEventListener("mouseup", onMouseUpWindow);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseDown, onMouseUpWindow, onMouseMove]);
  useEffect(() => {
    if (!isDragging) return;

    const deltaX = mouseCurrentPos.x - mouseStartPos.x;
    const deltaY = mouseCurrentPos.y - mouseStartPos.y;
    setClickDragDelta({ dx: deltaX, dy: deltaY });
    clickDragDeltaRef.current = { dx: deltaX, dy: deltaY };
  }, [mouseStartPos, mouseCurrentPos, isDragging]);

  return clickDragDelta;
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
