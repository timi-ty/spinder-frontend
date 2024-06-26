/**********BASE START**********/
class SpinderError {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export { SpinderError };
/**********BASE END**********/

/**********LOGIN START**********/
interface FinalizeLoginData {
  firebaseCustomToken: string;
}

type RequestAccessResult = "Allow" | "Pend";

export { type FinalizeLoginData, type RequestAccessResult };
/**********LOGIN END**********/

/**********AUTH START**********/
interface RenewedAuthData {
  userId: string;
  spotifyAccessTokenExpiresIn: number;
  firebaseIdTokenExpiresIn: number;
}

export { type RenewedAuthData };
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
//Composite sources function on their own as usable discover sources.
type DiscoverCompositeSource =
  | "Anything Me" //Randomly get 25 tracks from the user's top items, and use 5 of those to seed spotify recommendations for another 25 tracks.
  | "Spindr People" //Should change to My People (Spinder users that follow you) but requires more work to implement.
  | "My Artists" //Artists that the user follows. Mix up their discography and deliver.
  | "My Playlists"; //Playlists that the user owns/follows. Mix up their tracks and deliver.

//Solo sources here are source types and each requires a corresponding value/id to be valid.
type DiscoverSoloSource =
  | "Vibe" //Search playlists with this word(s) and randomly mix the tracks in them.
  | "Spindr Person" //"Anything Me" but for someone else.
  | "Artist" //Mix up a single artist's discography and deliver.
  | "Playlist" //Deliver the playlist as is.
  | "Radio"; //Deliver the playlist mixed with recommendations.

type DiscoverSourceType = DiscoverCompositeSource | DiscoverSoloSource;

interface DiscoverSource {
  type: DiscoverSourceType;
  id: string;
  name: string;
  image: string;
}

const defaultDiscoverSource: DiscoverSource = {
  type: "Anything Me",
  id: "anythingme",
  name: "Anything Me",
  image: "/resources/ic_anything_me_stars.svg",
};

interface DiscoverSourceData {
  selectedSource: DiscoverSource;
  availableSources: DiscoverSource[];
}

const emptyDiscoverSourceData: DiscoverSourceData = {
  selectedSource: defaultDiscoverSource,
  availableSources: [],
};

interface DiscoverSourceSearchResult {
  searchText: string;
  foundVibe: boolean;
  artists: DiscoverSource[];
  playlists: DiscoverSource[];
  spinderPeople: DiscoverSource[];
}

const emptySourceSearchResult: DiscoverSourceSearchResult = {
  searchText: "",
  foundVibe: false,
  artists: [],
  playlists: [],
  spinderPeople: [],
};

//For now, destination has to be a Spotify Playlist.
interface DiscoverDestination {
  name: string;
  image: string;
  id: string;
  isFavourites: boolean;
}

const defaultDiscoverDestination: DiscoverDestination = {
  name: "Favourites",
  image: "/resources/ic_favourites_heart.svg",
  id: "favourites",
  isFavourites: true,
};

interface DiscoverDestinationData {
  selectedDestination: DiscoverDestination;
  offset: number; // The index at which the server terminated it's search for valid discover destinations (i.e. user owned spotify playlists) in the total user playlists.
  total: number; // The total number of user playlists. The server searches these playlists for discover destinations (i.e. user owned playlists).
  availableDestinations: DiscoverDestination[];
}

const emptyDiscoverDestinationData: DiscoverDestinationData = {
  selectedDestination: defaultDiscoverDestination,
  offset: 0,
  total: 0,
  availableDestinations: [],
};

interface DiscoverDestinationSearchResult {
  searchText: string;
  playlists: DiscoverDestination[];
}

const emptyDestinationSearchResult: DiscoverDestinationSearchResult = {
  searchText: "",
  playlists: [],
};

export {
  type DiscoverSource,
  type DiscoverSourceData,
  emptyDiscoverSourceData,
  type DiscoverSourceSearchResult,
  emptySourceSearchResult,
  type DiscoverDestination,
  type DiscoverDestinationData,
  emptyDiscoverDestinationData,
  type DiscoverDestinationSearchResult,
  emptyDestinationSearchResult,
};
/**********DISCOVER END**********/

/**********DECK START**********/
interface DeckItem {
  trackId: string;
  image: string;
  previewUrl: string;
  trackName: string;
  trackUri: string;
  artists: DeckItemArtist[];
  relatedSources: DiscoverSource[];
}

interface DeckItemArtist {
  artistName: string;
  artistUri: string;
  artistImage: string;
}

const emptyDeckItem: DeckItem = {
  trackId: "",
  image: "",
  previewUrl: "",
  trackName: "",
  trackUri: "",
  artists: [],
  relatedSources: [],
};

export { type DeckItem, emptyDeckItem };
/**********DECK END**********/
