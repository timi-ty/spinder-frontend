// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithCustomToken } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8Txu3DhuE6KwWtA84NKiCE-25DErLLU0",
  authDomain: "spinder-e2ede.firebaseapp.com",
  projectId: "spinder-e2ede",
  storageBucket: "spinder-e2ede.appspot.com",
  messagingSenderId: "994462371760",
  appId: "1:994462371760:web:0b0c872ad671a3b3af5075",
  measurementId: "G-L6DBBBXD6Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);

async function firebaseSignInWithCustomToken(token: string): Promise<void> {
  try {
    const userCredential = await signInWithCustomToken(auth, token);
    const user = userCredential.user;
    console.log(
      `Firebase authenticated user with ID: ${user.uid}, Name: ${user.displayName}`
    );
    return;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed firebase sign in with custom token. Token: ${token}`
    );
  }
}

async function getFirebaseIdToken(): Promise<string> {
  try {
    console.log("Firebase trying to get id token...");
    const idToken = (await auth.currentUser?.getIdToken(true)) || null;
    if (idToken) {
      return idToken;
    } else {
      throw new Error("Failed to get firebase id token.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get firebase id token.");
  }
}

export { firebaseSignInWithCustomToken, getFirebaseIdToken };
