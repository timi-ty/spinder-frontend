import { loginWithSpotifyUrl } from "../../client/client.api";
import "../styles/Home.scss";

function Home() {
  return (
    <div className="home">
      <div>
        <h1>Spinder</h1>
      </div>
      <div>
        <a href={loginWithSpotifyUrl}>
          <button type="submit">Login with Spotify</button>
        </a>
      </div>
    </div>
  );
}

export default Home;
