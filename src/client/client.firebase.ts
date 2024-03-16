import { initializeApp } from "firebase/app";
import { Auth, getAuth, signInWithCustomToken } from "firebase/auth";
import {
  Database,
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getFirestore,
  onSnapshot,
  QuerySnapshot,
  setDoc,
} from "firebase/firestore";

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

var auth: Auth;
var database: Database;
var firestore: Firestore;

function startFirebaseClient() {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  database = getDatabase(app);
  firestore = getFirestore(app);
}

async function firebaseSignInWithCustomToken(token: string): Promise<string> {
  try {
    const userCredential = await signInWithCustomToken(auth, token);
    const user = userCredential.user;
    console.log(
      `Firebase authenticated user with ID: ${user.uid}, Name: ${user.displayName}`
    );
    attachPresenceService();
    return user.uid;
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
    const idToken = await auth.currentUser.getIdToken();
    return idToken;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get firebase id token.");
  }
}

interface PresenceStatus {
  state: "offline" | "online";
  lastChanged: object;
}

function attachPresenceService() {
  if (!auth.currentUser) {
    throw new Error(
      "Failed to attach presence service. User is not logged in."
    );
  }

  var uid = auth.currentUser.uid;
  var userStatusDatabaseRef = ref(database, "/status/" + uid);

  var isOfflineForDatabase: PresenceStatus = {
    state: "offline",
    lastChanged: serverTimestamp(),
  };
  var isOnlineForDatabase: PresenceStatus = {
    state: "online",
    lastChanged: serverTimestamp(),
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

function listenToFirestoreCollection(
  collectionPath: string,
  onChange: (snapshot: QuerySnapshot) => void
): () => void {
  const col = collection(firestore, collectionPath);

  const unsubscribe = onSnapshot(
    col,
    (querySnapshot) => {
      console.log(`Received query snapshot of size ${querySnapshot.size}`);
      onChange(querySnapshot);
    },
    (error) => {
      console.error(error);
    }
  );
  return unsubscribe;
}

async function setFireStoreDoc(docPath: string, data: any): Promise<void> {
  const docRef = doc(firestore, docPath);
  await setDoc(docRef, data);
}

async function deleteFireStoreDoc(docPath: string): Promise<void> {
  const docRef = doc(firestore, docPath);
  await deleteDoc(docRef);
}

async function isExistingFirestoreDoc(docPath: string): Promise<boolean> {
  const docRef = doc(firestore, docPath);
  const document = await getDoc(docRef);
  return document.exists();
}

export {
  startFirebaseClient,
  firebaseSignInWithCustomToken,
  getFirebaseIdToken,
  listenToFirestoreCollection,
  setFireStoreDoc,
  deleteFireStoreDoc,
  isExistingFirestoreDoc,
};
