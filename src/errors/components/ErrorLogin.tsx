import { useState } from "react";
import { Navigate } from "react-router-dom";
import "../styles/ErrorLogin.scss";

function ErrorLogin() {
  const [goHome, setGoHome] = useState(false);

  return (
    <div className="error-login">
      <div className="message">
        There was an error with login. If this error persists, go home and login
        with Spotify again.
      </div>
      <button className="button" onClick={() => window.location.reload()}>
        Reload
      </button>
      <button className="button" onClick={() => setGoHome(true)}>
        Go Home
      </button>
      {goHome && <Navigate to="/home" />}
    </div>
  );
}

export default ErrorLogin;
