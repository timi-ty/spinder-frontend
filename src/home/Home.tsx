import { loginWithSpotifyUrl } from "../client/client.api";

function Home() {
  return (
    <>
      <h1>Spinder</h1>
      <a href={loginWithSpotifyUrl}>
        <button type="submit">Login with Spotify</button>
      </a>
    </>
  );
}

export default Home;
