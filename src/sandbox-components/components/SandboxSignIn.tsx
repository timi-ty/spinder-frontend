import { useState, useEffect } from "react";
import { isExistingFirestoreDoc } from "../../client/client.firebase";
import FullComponentLoader from "../../generic/components/FullComponentLoader";
import styles from "../styles/SandboxSignIn.module.css";
import React from "react";
import { loginWithSpotifyUrl, requestAccess } from "../../client/client.api";
import { useDispatch } from "react-redux";
import { setAuthMode } from "../../state/slice.auth";

function SandboxSignIn() {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [emailField, setEmailField] = useState("");
  const [isAllowedUser, setIsAllowedUser] = useState(false);
  const [isPendingResult, setIsPendingResult] = useState(true);
  const [requestedAccess, setRequestedAccess] = useState(false);

  const dispatch = useDispatch();

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

  function continueAnon() {
    dispatch(setAuthMode("AcceptedAnon"));
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setDisableSubmit(true);

    if (requestedAccess) {
      //Access is already requested. Accept anon mode.
      continueAnon();
      return;
    }

    try {
      const accessResult = await requestAccess(emailField);
      if (accessResult === "Allow") {
        window.open(loginWithSpotifyUrl, "_self"); //Confirm this is not blocked by popups.
      } else {
        setRequestedAccess(true);
      }
    } catch (error) {
      console.error(error);
      setDisableSubmit(false);
    }
  }

  return (
    <form className={styles.sandboxSignIn} onSubmit={onSubmit} method="POST">
      {!requestedAccess && (
        <>
          <div className={styles.title}>Sign In</div>
          <input
            required
            className={styles.emailInput}
            id="email"
            name="email"
            type="email"
            value={emailField}
            disabled={disableSubmit}
            onChange={(ev) => setEmailField(ev.target.value)}
            placeholder="Your Spotify email address"
          />
          <div className={styles.submitContainer}>
            {isPendingResult && <FullComponentLoader />}
            {!isPendingResult && (
              <input
                disabled={disableSubmit}
                className={styles.button}
                type="submit"
                value={`${isAllowedUser ? "Let's Go!" : "Request Access"}`}
              />
            )}
          </div>
          <div className={styles.link} onClick={continueAnon}>
            Continue anonymously
          </div>
        </>
      )}
      {requestedAccess && (
        <>
          <div className={styles.title}>Be Anonymous For Now</div>
          <div className={styles.message}>
            Thank you for requesting access to the full version of Spindr!{" "}
            <br />
            <br />
            While we process your access request, please continue to use the
            limited version of Spindr in anonymous mode.
          </div>
          <input
            className={`${styles.submitContainer} ${styles.button}`}
            type="submit"
            value="Continue anonymously"
          />
        </>
      )}
    </form>
  );
}

export default SandboxSignIn;
