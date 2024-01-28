import { useState, useEffect } from "react";
import { finalizeLogin, getSpotifyProfile } from "../client/client";
import {
  SpotifyUserProfileData,
  emptySpotifyProfileData,
} from "../client/client.model";

export enum LOGIN_STATE {
  PENDING,
  LOGGED_IN,
  LOGGED_OUT,
}

export function useLoginState() {
  const [logInState, setLoginState] = useState(LOGIN_STATE.PENDING);
  useEffect(() => {
    finalizeLogin()
      .then((loggedIn: Boolean) => {
        console.log(`Using Login State: IsLoggedIn - ${logInState}.`);
        setLoginState(
          loggedIn ? LOGIN_STATE.LOGGED_IN : LOGIN_STATE.LOGGED_OUT
        );
      })
      .catch((error) => {
        console.log(`Using Login State: Logged out. Error: ${error}`);
        setLoginState(LOGIN_STATE.LOGGED_OUT);
      });
  }, []);

  return logInState;
}

export function useSpotifyProfileData() {
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
