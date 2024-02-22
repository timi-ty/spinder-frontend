import {
  firebaseSignInWithCustomToken,
  getFirebaseIdToken,
} from "./client.firebase";
import {
  DiscoverDestination,
  DiscoverDestinationData,
  DiscoverSource,
  DiscoverSourceData,
  DiscoverSourceSearchResult,
  FinalizeLoginData,
  RenewedAuth,
  SpinderErrorResponse,
  SpotifyUserProfileData,
} from "./client.model";

const backendUrl = "http://localhost:3000/api";

/**********LOGIN START**********/
const loginWithSpotifyUrl = `${backendUrl}/login`;

async function finalizeLogin(): Promise<string> {
  try {
    const url = `${backendUrl}/login/finalize`;

    const response = await fetch(url, fetchConfig());

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

/**********AUTH START**********/

async function renewAuthentication(): Promise<RenewedAuth> {
  try {
    const url = `${backendUrl}/auth/renew`;

    const response = await fetch(url, fetchConfig(await getBearerToken()));

    if (response.ok) {
      const renewedAuth: RenewedAuth = await response.json();
      return renewedAuth;
    } else {
      const errorResponse: SpinderErrorResponse = await response.json();
      throw new Error(
        `Status: ${errorResponse.error.status}, Message: ${errorResponse.error.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to renew authentication.");
  }
}
/**********AUTH END**********/

/**********USER START**********/

/**This request is authenticated with cookies instead of an explicit authourization header.*/
async function getSpotifyProfile(): Promise<SpotifyUserProfileData> {
  try {
    const url = `${backendUrl}/user/spotify`;

    const response = await fetch(url, fetchConfig());

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

async function getDiscoverSources(): Promise<DiscoverSourceData> {
  const getDiscoverSourcesUrl = `${backendUrl}/discover/sources`;
  try {
    const response = await fetch(
      getDiscoverSourcesUrl,
      fetchConfig(await getBearerToken())
    );

    if (response.ok) {
      const discoverSourceData: DiscoverSourceData = await response.json();
      return discoverSourceData;
    } else {
      const errorResponse: SpinderErrorResponse = await response.json();
      throw new Error(
        `Status: ${errorResponse.error.status}, Message: ${errorResponse.error.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get Discover sources.");
  }
}

async function searchDiscoverSources(
  searchText: string
): Promise<DiscoverSourceSearchResult> {
  try {
    const searchDiscoverSourcesUrl = `${backendUrl}/discover/sources/search`;

    const response = await fetch(
      `${searchDiscoverSourcesUrl}?q=${searchText}`,
      fetchConfig(await getBearerToken())
    );

    if (response.ok) {
      const discoverSourceSearchResult: DiscoverSourceSearchResult =
        await response.json();
      return discoverSourceSearchResult;
    } else {
      const errorResponse: SpinderErrorResponse = await response.json();
      throw new Error(
        `Status: ${errorResponse.error.status}, Message: ${errorResponse.error.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to search Discover sources.");
  }
}

async function postDiscoverSource(
  source: DiscoverSource
): Promise<DiscoverSource> {
  try {
    const setDiscoverSourceUrl = `${backendUrl}/discover/source`;

    const response = await fetch(
      `${setDiscoverSourceUrl}?source=${JSON.stringify(source)}`,
      fetchConfig(await getBearerToken(), "POST")
    );

    if (response.ok) {
      const responseData: DiscoverSource = await response.json();
      return responseData;
    } else {
      const errorResponse: SpinderErrorResponse = await response.json();
      throw new Error(
        `Status: ${errorResponse.error.status}, Message: ${errorResponse.error.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to set Discover destination.");
  }
}

async function getDiscoverDestinations(
  offset: number
): Promise<DiscoverDestinationData> {
  try {
    const getDiscoverDestinationsUrl = `${backendUrl}/discover/destinations`;

    const response = await fetch(
      `${getDiscoverDestinationsUrl}?offset=${offset}`,
      fetchConfig(await getBearerToken())
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

async function postDiscoverDestination(
  destination: DiscoverDestination
): Promise<DiscoverDestination> {
  try {
    const setDiscoverDestinationUrl = `${backendUrl}/discover/destination`;

    const response = await fetch(
      `${setDiscoverDestinationUrl}?destination=${JSON.stringify(destination)}`,
      fetchConfig(await getBearerToken(), "POST")
    );

    if (response.ok) {
      const responseData: DiscoverDestination = await response.json();
      return responseData;
    } else {
      const errorResponse: SpinderErrorResponse = await response.json();
      throw new Error(
        `Status: ${errorResponse.error.status}, Message: ${errorResponse.error.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to set Discover destination.");
  }
}
/**********DISCOVER END**********/

function fetchConfig(
  bearerToken: string = "",
  method: "GET" | "POST" = "GET"
): RequestInit {
  return {
    method: method,
    credentials: "include",
    headers: [
      ["X-Requested-With", "XMLHttpRequest"],
      ["Authorization", `Bearer ${bearerToken}`],
    ],
  };
}

async function getBearerToken(): Promise<string> {
  return await getFirebaseIdToken();
}

export {
  loginWithSpotifyUrl,
  finalizeLogin,
  renewAuthentication,
  getSpotifyProfile,
  getDiscoverSources,
  searchDiscoverSources,
  postDiscoverSource,
  getDiscoverDestinations,
  postDiscoverDestination,
};
