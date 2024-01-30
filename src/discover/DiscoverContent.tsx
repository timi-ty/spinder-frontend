import { useDiscoverSourceTypes, useSpotifyProfileData } from "../hooks/hooks";

function DiscoverContent() {
  const spotifyProfileData = useSpotifyProfileData();
  const discoverSourceTypes = useDiscoverSourceTypes();
  return (
    <>
      <h1>Discover</h1>
      <div>{spotifyProfileData.display_name}</div>
      <div>{spotifyProfileData.email}</div>
      <ul>
        {discoverSourceTypes.sourceTypes.map((sourceType, index) => (
          <li>{`${sourceType} ${
            index == discoverSourceTypes.selectedSourceType ? "(SELCETED)" : ""
          }`}</li>
        ))}
      </ul>
    </>
  );
}

export default DiscoverContent;
