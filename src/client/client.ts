import { firebaseSignInWithCustomToken } from "./client.firebase";
import { FinalizeLoginResponse, STATUS_OK } from "./client.model";

const backendUrl = "http://localhost:3000/api";

export const loginWithSpotifyUrl = backendUrl + "/login";

const finalizeLoginUrl = backendUrl + "/login/finalize";

export async function finalizeLogin(): Promise<boolean> {
  var loginResponse: FinalizeLoginResponse | null;
  try {
    const response = await fetch(finalizeLoginUrl, {
      method: "GET",
      credentials: "include",
    });
    loginResponse = await response.json();

    if (
      loginResponse?.status === STATUS_OK &&
      loginResponse.data.firebaseCustomToken
    ) {
      return firebaseSignInWithCustomToken(
        loginResponse.data.firebaseCustomToken
      );
    }

    return false;
  } catch (error: any) {
    throw new Error(`Failed to finalize login - ${error}`);
  }
}
