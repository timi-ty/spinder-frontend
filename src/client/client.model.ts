/**********BASE START**********/
const STATUS_OK = "ok";
const STATUS_ERROR = "error";

interface SpinderResponse<T> {
  status: string;
  data: T;
}

class SpinderErrorResponse implements SpinderResponse<Error> {
  status: string;
  code: string;
  data: Error;

  constructor(code: string, data: string) {
    this.status = STATUS_ERROR;
    this.code = code;
    this.data = new Error(data);
  }
}
/**********BASE END**********/

/**********LOGIN START**********/
interface FinalizeLoginData {
  firebaseCustomToken: string;
  spotifyAccessToken: string;
}

class FinalizeLoginResponse implements SpinderResponse<FinalizeLoginData> {
  status: string;
  data: FinalizeLoginData;

  constructor(status: string, data: FinalizeLoginData) {
    this.status = status;
    this.data = data;
  }
}
/**********LOGIN END**********/

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

class SpotifyUserProfileResponse
  implements SpinderResponse<SpotifyUserProfileData>
{
  status: string;
  data: SpotifyUserProfileData;

  constructor(status: string, data: SpotifyUserProfileData) {
    this.status = status;
    this.data = data;
  }
}
/**********USER END**********/

/**********DISCOVER START**********/
interface DiscoverSourceTypesData {
  selectedSourceType: number;
  sourceTypes: string[];
}

const emptyDiscoverSourceTypes: DiscoverSourceTypesData = {
  selectedSourceType: 0,
  sourceTypes: [],
};

class DiscoverSourceTypesResponse
  implements SpinderResponse<DiscoverSourceTypesData>
{
  status: string;
  data: DiscoverSourceTypesData;

  constructor(status: string, data: DiscoverSourceTypesData) {
    this.status = status;
    this.data = data;
  }
}
/**********DISCOVER END**********/

export {
  STATUS_OK,
  STATUS_ERROR,
  SpinderErrorResponse,
  FinalizeLoginResponse,
  type SpotifyUserProfileData,
  emptySpotifyProfileData,
  SpotifyUserProfileResponse,
  type DiscoverSourceTypesData,
  emptyDiscoverSourceTypes,
  DiscoverSourceTypesResponse,
};
