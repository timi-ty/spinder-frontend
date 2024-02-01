import { firebaseSignInWithCustomToken } from "./client.firebase";
import {
  DiscoverDestinationData,
  DiscoverSourceTypesData,
  FinalizeLoginData,
  SpinderErrorResponse,
  SpotifyUserProfileData,
} from "./client.model";

const backendUrl = "http://localhost:3000/api";

/**********LOGIN START**********/
const loginWithSpotifyUrl = backendUrl + "/login";
const finalizeLoginUrl = backendUrl + "/login/finalize";

async function finalizeLogin(): Promise<void> {
  try {
    const response = await fetch(finalizeLoginUrl, fetchConfig());

    if (response.ok) {
      const loginData: FinalizeLoginData = await response.json();
      return firebaseSignInWithCustomToken(loginData.firebaseCustomToken);
    } else {
      const errorResponse: SpinderErrorResponse = await response.json();
      throw new Error(
        `Status: ${errorResponse.error.status}, Message: ${errorResponse.error.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to finalize login.");
  }
}
/**********LOGIN END**********/

/**********USER START**********/
const getSpotifyProfileDataUrl = backendUrl + "/user/spotify";

async function getSpotifyProfile(): Promise<SpotifyUserProfileData> {
  try {
    const response = await fetch(getSpotifyProfileDataUrl, fetchConfig());

    if (response.ok) {
      const profileData: SpotifyUserProfileData = await response.json();
      return profileData;
    } else {
      const errorResponse: SpinderErrorResponse = await response.json();
      throw new Error(
        `Status: ${errorResponse.error.status}, Message: ${errorResponse.error.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get Spotify profile.");
  }
}
/**********USER END**********/

/**********DISCOVER START**********/
const getDiscoverSourceTypesUrl = backendUrl + "/discover/source-types";
const getDiscoverDestinationsUrl = backendUrl + "/discover/destinations";

async function getDiscoverSourceTypes(
  idToken: string
): Promise<DiscoverSourceTypesData> {
  try {
    const response = await fetch(
      getDiscoverSourceTypesUrl,
      fetchConfig(idToken)
    );

    if (response.ok) {
      const discoverSourceTypesResponse: DiscoverSourceTypesData =
        await response.json();
      return discoverSourceTypesResponse;
    } else {
      const errorResponse: SpinderErrorResponse = await response.json();
      throw new Error(
        `Status: ${errorResponse.error.status}, Message: ${errorResponse.error.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get Discover source types.");
  }
}

async function getDiscoverDestinations(
  idToken: string,
  offset: number
): Promise<DiscoverDestinationData> {
  try {
    const response = await fetch(
      `${getDiscoverDestinationsUrl}?offset=${offset}`,
      fetchConfig(idToken)
    );

    if (response.ok) {
      const discoverDestinationData: DiscoverDestinationData =
        await response.json();
      return discoverDestinationData;
    } else {
      const errorResponse: SpinderErrorResponse = await response.json();
      throw new Error(
        `Status: ${errorResponse.error.status}, Message: ${errorResponse.error.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get Discover destinations.");
  }
}
/**********DISCOVER END**********/

function fetchConfig(idToken: string = ""): RequestInit {
  return {
    method: "GET",
    credentials: "include",
    headers: [
      ["X-Requested-With", "XMLHttpRequest"],
      ["Authorization", `Bearer ${idToken}`],
    ],
  };
}

export {
  loginWithSpotifyUrl,
  finalizeLogin,
  getSpotifyProfile,
  getDiscoverSourceTypes,
  getDiscoverDestinations,
};
