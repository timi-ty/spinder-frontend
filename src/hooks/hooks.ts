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
        setLoginState(LOGIN_STATE.LOGGED_OUT);
        console.log(`Using Login State: Logged out. Error: ${error}`);
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
      .then((spotifyProfileData: SpotifyUserProfileData | null) => {
        if (spotifyProfileData) {
          console.log(
            `Using Spotify Profile: Name - ${spotifyProfileData?.display_name}, Email - ${spotifyProfileData?.email}.`
          );
          setSpotifyProfileData(spotifyProfileData);
        } else {
          throw new Error(`Using Spotify Profile. Error: Null profile data.`);
        }
      })
      .catch((error) => {
        throw new Error(`Using Spotify Profile. Error: ${error}`);
      });
  }, []);

  return spotifyProfileData;
}

function useFirebaseIdToken() {
  const [idToken, setIdToken] = useState("");
  useEffect(() => {
    getFirebaseIdToken()
      .then((idToken: string | null) => {
        if (idToken) {
          console.log(`Using firebase id token - ${idToken}.`);
          setIdToken(idToken);
        } else {
          throw new Error(`Using firebase id token. Error: Null token.`);
        }
      })
      .catch((error) => {
        throw new Error(`Using firebase id token. Error: ${error}`);
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
      .then((discoverSourceTypes: DiscoverSourceTypesData | null) => {
        if (discoverSourceTypes) {
          console.log(
            `Using discover source types - ${JSON.stringify(
              discoverSourceTypes
            )}.`
          );
          setDiscoverSourceTypes(discoverSourceTypes);
        } else {
          throw new Error(
            `Using discover source types. Error: Null source types.`
          );
        }
      })
      .catch((error) => {
        throw new Error(`Using discover source types. Error: ${error}`);
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
