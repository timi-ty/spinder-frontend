import { useState, useEffect } from "react";
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

enum LOGIN_STATE {
  PENDING,
  LOGGED_IN,
  LOGGED_OUT,
}

function useLoginState() {
  const [logInState, setLoginState] = useState(LOGIN_STATE.PENDING);
  useEffect(() => {
    finalizeLogin()
      .then((loggedIn: Boolean) => {
        setLoginState(
          loggedIn ? LOGIN_STATE.LOGGED_IN : LOGIN_STATE.LOGGED_OUT
        );
        console.log(`Using Login State: IsLoggedIn - ${loggedIn}.`);
      })
      .catch((error) => {
        console.error(error);
        setLoginState(LOGIN_STATE.LOGGED_OUT);
        console.error("Using Login State: Logged out. Error.");
      });
  }, []);

  return logInState;
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
        throw new Error("Using Spotify Profile. Error.");
      });
  }, []);

  return spotifyProfileData;
}

function useFirebaseIdToken() {
  const [idToken, setIdToken] = useState("");
  useEffect(() => {
    getFirebaseIdToken()
      .then((idToken: string) => {
        console.log(`Using Firebase id token - ${idToken}.`);
        setIdToken(idToken);
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Using Firebase id token. Error.");
      });
  }, []);

  return idToken;
}

function useDiscoverSourceTypes() {
  const [discoverSourceTypes, setDiscoverSourceTypes] = useState(
    emptyDiscoverSourceTypes
  );
  const idToken = useFirebaseIdToken();
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
        throw new Error("Using Discover source types. Error.");
      });
  }, [idToken]);

  return discoverSourceTypes;
}

function useDiscoverDestiantions() {
  const [discoverDestinations, setDiscoverDestinations] = useState(
    emptyDiscoverDestinations
  );
  const idToken = useFirebaseIdToken();
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
        throw new Error("Using Discover destinations. Error.");
      });
  }, [idToken]);

  return discoverDestinations;
}

export {
  LOGIN_STATE,
  useLoginState,
  useSpotifyProfileData,
  useFirebaseIdToken,
  useDiscoverSourceTypes,
  useDiscoverDestiantions,
};
