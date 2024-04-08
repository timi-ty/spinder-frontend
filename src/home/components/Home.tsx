import { useEffect, useState } from "react";
import { requestAccessUrl } from "../../client/client.api";
import "../styles/Home.scss";
import { isExistingFirestoreDoc } from "../../client/client.firebase";
import FullComponentLoader from "../../generic/components/FullComponentLoader";

const appUrl = import.meta.env.DEV
  ? "http://localhost:5173/"
  : "https://spindr.pro/";

function Home() {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [emailField, setEmailField] = useState("");
  const [isAllowedUser, setIsAllowedUser] = useState(false);
  const [isPendingResult, setIsPendingResult] = useState(true);

  useEffect(() => {
    setDisableSubmit(false);
    setIsPendingResult(true);
    isExistingFirestoreDoc(`allowedUsers/${emailField}`)
      .then((allowed) => {
        setIsAllowedUser(allowed);
        setIsPendingResult(false);
      })
      .catch(() => {
        setIsAllowedUser(false);
        setIsPendingResult(false);
      });
  }, [emailField]);

  return (
    <div className="home">
      <div>
        <h1>Spindr</h1>
      </div>
      <div>
        <div>Find music you love.</div>
      </div>
      {/* This should change app state rather than unecessarilly loading the app again */}
      <a href={appUrl} className="submit-container">
        <button className="submit" type="submit">
          Launch Spindr
        </button>
      </a>
      {/* <form
        action={requestAccessUrl}
        onSubmit={() => setDisableSubmit(true)}
        method="POST"
      >
        <input
          required
          className="email-input"
          id="email"
          name="email"
          type="email"
          value={emailField}
          onChange={(ev) => setEmailField(ev.target.value)}
          placeholder="Your Spotify email address"
        />
        <div className="submit-container">
          {isPendingResult && <FullComponentLoader />}
          {!isPendingResult && (
            <input
              disabled={disableSubmit}
              className="submit"
              type="submit"
              value={`${isAllowedUser ? "Let's Go!" : "Request Access"}`}
            />
          )}
        </div>
      </form> */}
    </div>
  );
}

export default Home;
