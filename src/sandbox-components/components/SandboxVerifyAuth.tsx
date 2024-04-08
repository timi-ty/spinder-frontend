import { useState, useEffect } from "react";
import { requestAccessUrl } from "../../client/client.api";
import { isExistingFirestoreDoc } from "../../client/client.firebase";
import FullComponentLoader from "../../generic/components/FullComponentLoader";
import "../styles/SandboxVerifyAuth.scss";
import React from "react";

function SandboxVerifyAuth() {
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
    <form
      className="popup-verify-auth"
      action={requestAccessUrl}
      onSubmit={() => setDisableSubmit(true)}
      method="POST"
    >
      <div>Sign In</div>
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
      <div className="link">Continue anonymously</div>
    </form>
  );
}

export default SandboxVerifyAuth;
