import { useState, useEffect } from "react";
import {
  finalizeLogin,
  getDiscoverSourceTypes,
  getSpotifyProfile,
} from "../client/client";
import {
  DiscoverSourceTypesData,
  SpotifyUserProfileData,
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
        console.log(`Using firebase id token - ${idToken}.`);
        setIdToken(idToken);
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Using firebase id token. Error.");
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
          `Using discover source types - ${JSON.stringify(
            discoverSourceTypes
          )}.`
        );
        setDiscoverSourceTypes(discoverSourceTypes);
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Using discover source types. Error.");
      });
  }, [idToken]);

  return discoverSourceTypes;
}

export {
  LOGIN_STATE,
  useLoginState,
  useSpotifyProfileData,
  useFirebaseIdToken,
  useDiscoverSourceTypes,
};
