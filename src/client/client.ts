import { firebaseSignInWithCustomToken } from "./client.firebase";
import {
  DiscoverSourceTypesData,
  DiscoverSourceTypesResponse,
  FinalizeLoginResponse,
  STATUS_OK,
  SpotifyUserProfileData,
  SpotifyUserProfileResponse,
} from "./client.model";

const backendUrl = "http://localhost:3000/api";

/**********LOGIN START**********/
const loginWithSpotifyUrl = backendUrl + "/login";
const finalizeLoginUrl = backendUrl + "/login/finalize";

async function finalizeLogin(): Promise<boolean> {
  var loginResponse: FinalizeLoginResponse | null;
  try {
    const response = await fetch(finalizeLoginUrl, {
      method: "GET",
      credentials: "include",
    });
    loginResponse = await response.json();

    if (
      loginResponse?.status === STATUS_OK &&
      loginResponse.data.firebaseCustomToken
    ) {
      return firebaseSignInWithCustomToken(
        loginResponse.data.firebaseCustomToken
      );
    }

    return false;
  } catch (error: any) {
    throw new Error(`Failed to finalize login - ${error}`);
  }
}
/**********LOGIN END**********/

/**********USER START**********/
const getSpotifyProfileDataUrl = backendUrl + "/user/spotify";

async function getSpotifyProfile(): Promise<SpotifyUserProfileData | null> {
  var profileResponse: SpotifyUserProfileResponse | null;
  try {
    const response = await fetch(getSpotifyProfileDataUrl, {
      method: "GET",
      credentials: "include",
    });
    profileResponse = await response.json();

    if (profileResponse?.status === STATUS_OK) {
      return profileResponse.data;
    }

    return null;
  } catch (error: any) {
    throw new Error(`Failed to get Spotify profile - ${error}`);
  }
}
/**********USER END**********/

/**********DISCOVER START**********/
const getDiscoverSourceTypesUrl = backendUrl + "/discover/source-types";

async function getDiscoverSourceTypes(
  idToken: string
): Promise<DiscoverSourceTypesData | null> {
  var discoverSourceTypesResponse: DiscoverSourceTypesResponse | null;
  try {
    const response = await fetch(getDiscoverSourceTypesUrl, {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${idToken}` },
    });
    discoverSourceTypesResponse = await response.json();

    if (discoverSourceTypesResponse?.status === STATUS_OK) {
      return discoverSourceTypesResponse.data;
    }
    console.error("Null discover source types. An error occured.");
    return null;
  } catch (error: any) {
    throw new Error(`Failed to get Discover source types - ${error}`);
  }
}
/**********DISCOVER END**********/

export {
  loginWithSpotifyUrl,
  finalizeLogin,
  getSpotifyProfile,
  getDiscoverSourceTypes,
};
