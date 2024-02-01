import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA8Txu3DhuE6KwWtA84NKiCE-25DErLLU0",
  authDomain: "spinder-e2ede.firebaseapp.com",
  databaseURL:
    "https://spinder-e2ede-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "spinder-e2ede",
  storageBucket: "spinder-e2ede.appspot.com",
  messagingSenderId: "994462371760",
  appId: "1:994462371760:web:0b0c872ad671a3b3af5075",
  measurementId: "G-L6DBBBXD6Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

async function firebaseSignInWithCustomToken(token: string): Promise<void> {
  try {
    const userCredential = await signInWithCustomToken(auth, token);
    const user = userCredential.user;
    console.log(
      `Firebase authenticated user with ID: ${user.uid}, Name: ${user.displayName}`
    );
    attachPresenceService();
    return;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed firebase sign in with custom token. Token: ${token}`
    );
  }
}

async function getFirebaseIdToken(): Promise<string> {
  if (!auth.currentUser) {
    throw new Error("Failed to get firebase id token. User is not logged in.");
  }

  try {
    console.log("Firebase trying to get id token...");
    const idToken = await auth.currentUser.getIdToken(true);
    return idToken;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get firebase id token.");
  }
}

function attachPresenceService() {
  if (!auth.currentUser) {
    throw new Error(
      "Failed to attach presence service. User is not logged in."
    );
  }

  var uid = auth.currentUser.uid;
  var userStatusDatabaseRef = ref(database, "/status/" + uid);

  var isOfflineForDatabase = {
    state: "offline",
    last_changed: serverTimestamp(),
  };
  var isOnlineForDatabase = {
    state: "online",
    last_changed: serverTimestamp(),
  };

  const isConnectedRef = ref(database, ".info/connected");
  onValue(isConnectedRef, function (snapshot) {
    if (snapshot.val() == false) {
      return;
    }
    onDisconnect(userStatusDatabaseRef)
      .set(isOfflineForDatabase)
      .then(function () {
        set(userStatusDatabaseRef, isOnlineForDatabase);
      });
  });
}

export { firebaseSignInWithCustomToken, getFirebaseIdToken };
