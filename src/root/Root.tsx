import { useEffect, useState } from "react";
import { finalizeLogin } from "../client/client";
import { Navigate } from "react-router-dom";

const PENDING = 0;
const SUCCESS = 1;
const FAILURE = -1;

function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(PENDING);
  useEffect(() => {
    finalizeLogin()
      .then((loggedIn: Boolean) => {
        console.log(`Root redirect,  isLoggedIn ${isLoggedIn}.`);
        setIsLoggedIn(loggedIn ? SUCCESS : FAILURE);
      })
      .catch((error) => {
        console.log(`Root error: ${error}`);
        setIsLoggedIn(FAILURE);
      });
  });

  return (
    <>
      {isLoggedIn === PENDING && <div>Loading...</div>}
      {isLoggedIn === SUCCESS && <Navigate to="/discover" />}
      {isLoggedIn === FAILURE && <Navigate to="/home" />}
    </>
  );
}

export default Root;
