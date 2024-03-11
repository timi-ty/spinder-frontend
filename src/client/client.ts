import { logoutAuthResource } from "../state/slice.auth";
import { dispatch, store } from "../state/store";
import { renewAuthentication } from "./client.api";
import { startFirebaseClient } from "./client.firebase";

startFirebaseClient();

var renewAuthHandle: NodeJS.Timeout | null = null;
var activeRenewInterval: number;

function startRenewingAuthentication(intervalInMinutes: number) {
  if (renewAuthHandle) {
    console.warn(
      `Already renewing authentication every ${activeRenewInterval} minutes. Aborting the request to renew every ${intervalInMinutes} minutes...`
    );
    return;
  }
  if (intervalInMinutes < 1) {
    console.warn(
      `Cannot renew authentication every ${intervalInMinutes} because the minium interval is 1 minute. Aborting...`
    );
    return;
  }

  const intervalMillis = intervalInMinutes * 60 * 1000;
  renewAuthHandle = setInterval(renewAutheticationCallback, intervalMillis);
  activeRenewInterval = intervalInMinutes;
  console.log(
    `Started renewing authentication every ${intervalInMinutes} minutes.`
  );
}

function stopRenewingAuthentication() {
  if (!renewAuthHandle) {
    console.warn(
      "Tried to stop renewing authentication but it authentication renewal has not yet started."
    );
    return;
  }
  clearInterval(renewAuthHandle);
  console.log(
    `Stopped renewing authentication every ${activeRenewInterval} minutes.`
  );
  renewAuthHandle = null;
}

var retryAttempts = 0;

async function renewAutheticationCallback() {
  renewAuthentication()
    .then((renewedAuth) => {
      retryAttempts = 0;
      console.log(
        `Renewed Authentication - UserId: ${
          renewedAuth.userId
        }, SpotifyTokenExpiresIn: ${
          renewedAuth.spotifyAccessTokenExpiresIn / 60000
        } mins, FirebaseTokenExpiresIn: ${
          renewedAuth.firebaseIdTokenExpiresIn / 60000
        } mins.`
      );
    })
    .catch(() => {
      if (retryAttempts < 5) {
        retryAttempts++;
        setTimeout(renewAutheticationCallback, 120000); //Retry in 2 mins.
      }
    });
}

function logout() {
  //Make logout API request here.
  dispatch(logoutAuthResource());
}

//Block all window level listeners (the app should not be interactive while waiting for full screen mode).
const blockAllMouse = (ev: MouseEvent) => {
  const block = store.getState().globalUIState.isAwaitingFullScreen;
  if (block) ev.stopImmediatePropagation();
};
const blockAllTouch = (ev: TouchEvent) => {
  const block = store.getState().globalUIState.isAwaitingFullScreen;
  if (block) ev.stopImmediatePropagation();
};

//The blocking listeneres must be the first attached listeners and should not be detachd through the lifetime of the app.
window.addEventListener("mousedown", blockAllMouse);
window.addEventListener("mouseup", blockAllMouse);
window.addEventListener("mousemove", blockAllMouse);

window.addEventListener("touchstart", blockAllTouch);
window.addEventListener("touchmove", blockAllTouch);
window.addEventListener("touchend", blockAllTouch);

export { startRenewingAuthentication, stopRenewingAuthentication, logout };
