import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  AuthStatus,
  AuthMode,
  emptyAuthResource,
  errorAuthResource,
  loadAuthResource,
  loginAuthResource,
  setAuthMode,
} from "../state/slice.auth";
import { StoreState, dispatch } from "../state/store";
import {
  startRenewingAuthentication,
  stopRenewingAuthentication,
} from "../client/client";
import {
  finalizeLogin,
  anonymousLogin,
  getSpotifyAccessToken,
} from "../client/client.api";

function useAuthResource() {
  const authStatus = useSelector<StoreState, AuthStatus>(
    (state) => state.authState.status
  );
  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
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

  return { authStatus: authStatus, authMode: authMode };
}

async function completeLoginWithSpotifyToken(userId: string): Promise<void> {
  try {
    const spotifyAccessToken = await getSpotifyAccessToken();
    dispatch(loginAuthResource({ userId, spotifyAccessToken }));
    console.log(`Using Authentication for User:: ${userId}`);
  } catch (error) {
    console.error("Failed to get Spotify access token:", error);
    // Still login but without token - audio won't work but app will function
    dispatch(loginAuthResource({ userId, spotifyAccessToken: "" }));
  }
}

function loadAuth(): () => void {
  dispatch(loadAuthResource());

  finalizeLogin()
    .then((userId) => {
      completeLoginWithSpotifyToken(userId);
    })
    .catch((error) => {
      if (error.status === 401) {
        //Unauthorized is a special error we handle in a way to allow anonymous users.
        dispatch(loadAuthResource());
        dispatch(setAuthMode("UnacceptedAnon"));
        //Call API that can do a partial login. If it succeeds, set auth resource to logged in.
        anonymousLogin()
          .then((userId) => {
            completeLoginWithSpotifyToken(userId);
            console.log(`Using anon authentication for User:: ${userId}`);
          })
          .catch((error) => {
            console.error(error);
            dispatch(errorAuthResource());
            console.error("Failed to use anon authentication:: Error.");
          });
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

export default useAuthResource;
