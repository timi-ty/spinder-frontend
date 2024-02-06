import { useState, useEffect, useContext } from "react";
import {
  finalizeLogin,
  getDiscoverDestinations,
  getDiscoverSourceTypes,
  getSpotifyProfile,
} from "../client/client.api";
import {
  DiscoverDestinationData,
  DiscoverSourceTypesData,
  SpotifyUserProfileData,
  emptyDiscoverDestinations,
  emptyDiscoverSourceTypes,
  emptySpotifyProfileData,
} from "../client/client.model";
import { getFirebaseIdToken } from "../client/client.firebase";
import { AuthContext } from "./context";
import { AuthenticationState } from "./models";
import { startDeckClient, stopDeckClient } from "../client/client.deck";

function useAuthenticationState(defaultState: AuthenticationState) {
  const [authState, setAuthState] = useState(defaultState);
  useEffect(() => {
    finalizeLogin()
      .then(async (userId) => {
        try {
          const idToken = await getFirebaseIdToken();
          setAuthState({ state: "LoggedIn", token: idToken, userId: userId });
          console.log(
            `Using authentication token: ${idToken} for user: ${userId}`
          );
        } catch (error) {
          console.error(error);
          setAuthState({ state: "LoggedOut", token: "", userId: "" });
          console.error("Failed to use Authentication: Logged out.");
        }
      })
      .catch((error) => {
        console.error(error);
        setAuthState({ state: "LoggedOut", token: "", userId: "" });
        console.error("Failed to use Authentication: Logged out.");
      });
  }, []);

  return authState;
}

function useSpotifyProfileData() {
  const [spotifyProfileData, setSpotifyProfileData] = useState(
    emptySpotifyProfileData
  );
  useEffect(() => {
    getSpotifyProfile()
      .then((spotifyProfileData: SpotifyUserProfileData) => {
        console.log(
          `Using Spotify Profile: Name - ${spotifyProfileData.display_name}, Email - ${spotifyProfileData.email}.`
        );
        setSpotifyProfileData(spotifyProfileData);
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Failed to use Spotify Profile. Error.");
      });
  }, []);

  return spotifyProfileData;
}

function useDiscoverSourceTypes() {
  const authState = useContext(AuthContext);
  const [discoverSourceTypes, setDiscoverSourceTypes] = useState(
    emptyDiscoverSourceTypes
  );
  useEffect(() => {
    getDiscoverSourceTypes(authState.token)
      .then((discoverSourceTypes: DiscoverSourceTypesData) => {
        console.log(
          `Using Discover source types - ${JSON.stringify(
            discoverSourceTypes
          )}.`
        );
        setDiscoverSourceTypes(discoverSourceTypes);
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Failed to use Discover source types. Error.");
      });
  }, [authState]);

  return discoverSourceTypes;
}

function useDiscoverDestinations() {
  const authState = useContext(AuthContext);
  const [discoverDestinations, setDiscoverDestinations] = useState(
    emptyDiscoverDestinations
  );
  useEffect(() => {
    getDiscoverDestinations(authState.token, 0)
      .then((discoverDestinations: DiscoverDestinationData) => {
        console.log(
          `Using Discover destinations - ${JSON.stringify(
            discoverDestinations
          )}.`
        );
        setDiscoverDestinations(discoverDestinations);
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Failed to use Discover destinations. Error.");
      });
  }, [authState]);

  return discoverDestinations;
}

function useReadyTracks(): boolean {
  const authState = useContext(AuthContext);
  const [isTracksReady, setIsTracksReady] = useState(false);
  useEffect(() => {
    startDeckClient(authState.userId, () => {
      setIsTracksReady(true);
    });
    return () => {
      stopDeckClient();
    };
  }, [authState]);

  return isTracksReady;
}

export {
  useAuthenticationState,
  useSpotifyProfileData,
  useDiscoverSourceTypes,
  useDiscoverDestinations,
  useReadyTracks,
};
