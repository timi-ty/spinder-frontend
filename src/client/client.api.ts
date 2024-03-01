import {
  firebaseSignInWithCustomToken,
  getFirebaseIdToken,
} from "./client.firebase";
import {
  DeckItem,
  DiscoverDestination,
  DiscoverDestinationData,
  DiscoverSource,
  DiscoverSourceData,
  DiscoverSourceSearchResult,
  FinalizeLoginData,
  RenewedAuthData,
  SpinderError,
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
      const errorResponse: SpinderError = await response.json();

      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to finalize login.");
  }
}
/**********LOGIN END**********/

/**********AUTH START**********/
async function renewAuthentication(): Promise<RenewedAuthData> {
  try {
    const url = `${backendUrl}/auth/renew`;

    const response = await fetch(url, fetchConfig(await getBearerToken()));

    if (response.ok) {
      const renewedAuth: RenewedAuthData = await response.json();
      return renewedAuth;
    } else {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
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
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
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
  const url = `${backendUrl}/discover/sources`;

  try {
    const response = await fetch(url, fetchConfig(await getBearerToken()));

    if (response.ok) {
      const discoverSourceData: DiscoverSourceData = await response.json();
      return discoverSourceData;
    } else {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
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
    const url = `${backendUrl}/discover/sources/search`;

    const response = await fetch(
      `${url}?q=${searchText}`,
      fetchConfig(await getBearerToken())
    );

    if (response.ok) {
      const discoverSourceSearchResult: DiscoverSourceSearchResult =
        await response.json();
      return discoverSourceSearchResult;
    } else {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to search Discover sources.");
  }
}

async function changeDiscoverSource(
  source: DiscoverSource
): Promise<DiscoverSource> {
  try {
    const url = `${backendUrl}/discover/source`;

    const response = await fetch(
      `${url}?source=${safeStringify(source)}`,
      fetchConfig(await getBearerToken(), "POST")
    );

    if (response.ok) {
      const responseData: DiscoverSource = await response.json();
      return responseData;
    } else {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
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
    const url = `${backendUrl}/discover/destinations`;

    const response = await fetch(
      `${url}?offset=${offset}`,
      fetchConfig(await getBearerToken())
    );

    if (response.ok) {
      const discoverDestinationData: DiscoverDestinationData =
        await response.json();
      return discoverDestinationData;
    } else {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get Discover destinations.");
  }
}

async function changeDiscoverDestination(
  destination: DiscoverDestination
): Promise<DiscoverDestination> {
  try {
    const url = `${backendUrl}/discover/destination`;

    const response = await fetch(
      `${url}?destination=${safeStringify(destination)}`,
      fetchConfig(await getBearerToken(), "POST")
    );

    if (response.ok) {
      const responseData: DiscoverDestination = await response.json();
      return responseData;
    } else {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to set Discover destination.");
  }
}

async function refillDiscoverSourceDeck(): Promise<DiscoverSource> {
  try {
    const url = `${backendUrl}/discover/deck/source/refill`;

    const response = await fetch(url, fetchConfig(await getBearerToken()));

    if (response.ok) {
      const responseData: DiscoverSource = await response.json();
      return responseData;
    } else {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to set refill source deck.");
  }
}

async function resetDiscoverDestinationDeck(): Promise<DiscoverDestination> {
  try {
    const url = `${backendUrl}/discover/deck/destination/reset`;

    const response = await fetch(url, fetchConfig(await getBearerToken()));

    if (response.ok) {
      const responseData: DiscoverDestination = await response.json();
      return responseData;
    } else {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to reset destination deck.");
  }
}

async function saveToDestination(item: DeckItem): Promise<void> {
  try {
    const url = `${backendUrl}/discover/deck/destination/save`;

    const response = await fetch(
      `${url}?item=${safeStringify(item)}`,
      fetchConfig(await getBearerToken())
    );

    if (!response.ok) {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to refresh Discover destination.");
  }
}

async function removeFromDestination(
  destination: DiscoverDestination,
  item: DeckItem
): Promise<void> {
  try {
    const url = `${backendUrl}/discover/deck/destination/remove`;

    const response = await fetch(
      `${url}?destination=${safeStringify(destination)}&item=${safeStringify(
        item
      )}`,
      fetchConfig(await getBearerToken())
    );

    if (!response.ok) {
      const errorResponse: SpinderError = await response.json();
      throw new Error(
        `Status: ${errorResponse.status}, Message: ${errorResponse.message}`
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to refresh Discover destination.");
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

function safeStringify(data: any) {
  return JSON.stringify(data, (_key, value) => {
    if (typeof value === "string") {
      return value.replace(/[^\w\s]/g, (char) => {
        // Replace special characters with their Unicode escape sequences
        return "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0");
      });
    }
    return value;
  });
}

export {
  loginWithSpotifyUrl,
  finalizeLogin,
  renewAuthentication,
  getSpotifyProfile,
  getDiscoverSources,
  searchDiscoverSources,
  changeDiscoverSource,
  getDiscoverDestinations,
  changeDiscoverDestination,
  refillDiscoverSourceDeck,
  resetDiscoverDestinationDeck,
  saveToDestination,
  removeFromDestination,
};
