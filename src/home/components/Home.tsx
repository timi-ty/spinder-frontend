import { useState } from "react";
import { requestAccessUrl } from "../../client/client.api";
import "../styles/Home.scss";

function Home() {
  const [disableSubmit, setDisableSubmit] = useState(false);

  return (
    <div className="home">
      <div>
        <h1>Spindr</h1>
      </div>
      <div>
        <div>Find music you love.</div>
      </div>
      <form action={requestAccessUrl} onSubmit={() => setDisableSubmit(true)}>
        <input
          required
          className="email-input"
          id="email"
          name="email"
          type="email"
          placeholder="Your Spotify email address"
        />
        <input
          disabled={disableSubmit}
          className="request-access"
          type="submit"
          value={"Request access"}
        />
      </form>
    </div>
  );
}

export default Home;
