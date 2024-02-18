/**********BASE START**********/
class SpinderError {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

interface SpinderErrorResponse {
  error: SpinderError;
}

export { SpinderError, type SpinderErrorResponse };
/**********BASE END**********/

/**********LOGIN START**********/
interface FinalizeLoginData {
  firebaseCustomToken: string;
  spotifyAccessToken: string;
}
/**********LOGIN END**********/

/**********AUTH START**********/
interface RenewedAuth {
  userId: string;
  spotifyAccessToken: string;
  spotifyAccessTokenExpiresIn: number;
  firebaseIdToken: string;
  firebaseIdTokenExpiresIn: number;
}

export { type FinalizeLoginData, type RenewedAuth };
/**********AUTH START**********/

/**********USER START**********/
interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

const emptyExplicitContent: ExplicitContent = {
  filter_enabled: false,
  filter_locked: false,
};

interface ExternalUrls {
  spotify: string;
}

const emptyExternalUrls: ExternalUrls = {
  spotify: "",
};

interface Followers {
  href: string;
  total: number;
}

const emptyFollowers: Followers = {
  href: "",
  total: 0,
};

interface Image {
  url: string;
  height: number;
  width: number;
}

interface SpotifyUserProfileData {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

const emptySpotifyProfileData: SpotifyUserProfileData = {
  country: "",
  display_name: "",
  email: "",
  explicit_content: emptyExplicitContent,
  external_urls: emptyExternalUrls,
  followers: emptyFollowers,
  href: "",
  id: "",
  images: [],
  product: "",
  type: "",
  uri: "",
};

export { type SpotifyUserProfileData, emptySpotifyProfileData };
/**********USER END**********/

/**********DISCOVER START**********/
type DiscoverSource =
  | "Anything Me"
  | "Following"
  | "Playlist"
  | "Artiste"
  | "Keyword";

interface DiscoverSourceData {
  selectedSource: DiscoverSource;
  availableSources: DiscoverSource[];
}

const emptyDiscoverSourceData: DiscoverSourceData = {
  selectedSource: "Anything Me",
  availableSources: [],
};

//For now, destination has to be a Spotify Playlist.
interface DiscoverDestination {
  name: string;
  image: string;
  id: string;
}

const emptyDiscoverDestination: DiscoverDestination = {
  name: "",
  image: "",
  id: "",
};

interface DiscoverDestinationData {
  selectedDestination: DiscoverDestination;
  offset: number; // The index at which the server terminated it's search for valid discover destinations (i.e. user owned spotify playlists) in the total user playlists.
  total: number; // The total number of user playlists. The server searches these playlists for discover destinations (i.e. user owned playlists).
  availableDestinations: DiscoverDestination[];
}

const emptyDiscoverDestinationData: DiscoverDestinationData = {
  selectedDestination: emptyDiscoverDestination,
  offset: 0,
  total: 0,
  availableDestinations: [],
};

export {
  type DiscoverSourceData,
  emptyDiscoverSourceData,
  type DiscoverDestination,
  type DiscoverDestinationData,
  emptyDiscoverDestinationData,
};
/**********DISCOVER END**********/

/**********DECK START**********/
interface DeckItem {
  trackId: string;
  image: string;
  previewUrl: string;
  trackName: string;
  trackUri: string;
  artistName: string;
  artistUri: string;
}

export { type DeckItem };
/**********DECK END**********/
