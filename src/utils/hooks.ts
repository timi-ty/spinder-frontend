import { useState, useEffect, useContext } from "react";
import {
  finalizeLogin,
  getDiscoverDestinations,
  getDiscoverSourceTypes,
  getSpotifyProfile,
} from "../client/client";
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

interface AuthenticationState {
  state: "Pending" | "LoggedIn" | "LoggedOut";
  token: string;
}

function useAuthenticationState(defaultState: AuthenticationState) {
  const [authState, setAuthState] = useState(defaultState);
  useEffect(() => {
    finalizeLogin()
      .then(async () => {
        try {
          const idToken = await getFirebaseIdToken();
          setAuthState({ state: "LoggedIn", token: idToken });
          console.log(`Using authentication token: ${idToken}`);
        } catch (error) {
          console.error(error);
          setAuthState({ state: "LoggedOut", token: "" });
          console.error("Failed to use Authentication: Logged out.");
        }
      })
      .catch((error) => {
        console.error(error);
        setAuthState({ state: "LoggedOut", token: "" });
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
  const idToken = useContext(AuthContext);
  const [discoverSourceTypes, setDiscoverSourceTypes] = useState(
    emptyDiscoverSourceTypes
  );
  useEffect(() => {
    getDiscoverSourceTypes(idToken)
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
  }, [idToken]);

  return discoverSourceTypes;
}

function useDiscoverDestiantions() {
  const idToken = useContext(AuthContext);
  const [discoverDestinations, setDiscoverDestinations] = useState(
    emptyDiscoverDestinations
  );
  useEffect(() => {
    getDiscoverDestinations(idToken, 0)
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
  }, [idToken]);

  return discoverDestinations;
}

export {
  type AuthenticationState,
  useAuthenticationState,
  useSpotifyProfileData,
  useDiscoverSourceTypes,
  useDiscoverDestiantions,
};
