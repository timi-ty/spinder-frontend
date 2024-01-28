import { useSpotifyProfileData } from "../hooks/hooks";

function DiscoverContent() {
  const spotifyProfileData = useSpotifyProfileData();
  return (
    <>
      <h1>Discover</h1>
      <div>{spotifyProfileData.display_name}</div>
      <div>{spotifyProfileData.email}</div>
    </>
  );
}

export default DiscoverContent;
