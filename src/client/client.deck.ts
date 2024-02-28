import { refreshDeck } from "./client.api";
import {
  deleteFireStoreDoc,
  listenToFirestoreCollection,
  setFireStoreDoc,
} from "./client.firebase";
import { DeckItem } from "./client.model";

var userId: string;

//Track deck must be treated as a data store that gets fed from outside but never changes wrt to user interaction.
//This way, we don't break React's state management paradigm.
//Track deck grows indefinitely until the deck client is restarted. We can choose to address this.
var sourceDeck: DeckItem[] = [];
var unsub: () => void = () => {};
var onClearDeck: () => void = () => {};

//Start deck client is called from react and we must ensure that every time it is called, the result is the same. Track deck is re-initialized on every call.
function startDeckClient(
  clientId: string,
  onDeckReady: () => void,
  onDeckUnready: () => void,
  minSourceDeckSize = 3
) {
  console.log("Starting deck client...");
  userId = clientId;
  onClearDeck = onDeckUnready; //Mark the tracks as not ready everytime the deck is cleared.
  clearDeck();
  refreshDeck(); //A promise that we don't have to wait for because of firestore web sockets.
  unsub = listenToFirestoreCollection(
    `users/${clientId}/sourceDeck`,
    (snapshot) => {
      snapshot.docChanges().forEach((change, index) => {
        if (change.type == "added") {
          const track: DeckItem = change.doc.data() as DeckItem;
          sourceDeck.push(track);

          if (index >= minSourceDeckSize - 1) {
            onDeckReady(); //There are at least minSourceDeckSize tracks ready to be used.
          }
        }
      });
    }
  );
}

function stopDeckClient() {
  console.log("Stopping deck client...");
  unsub();
  clearDeck();
}

function clearDeck() {
  sourceDeck = [];
  onClearDeck();
}

function getDeckItem(index: number): DeckItem {
  if (index >= sourceDeck.length)
    throw new Error(
      `Source deck of size ${sourceDeck.length} does not have an item at index ${index}.`
    );
  return sourceDeck[index];
}

function saveTrack(currentTrack: DeckItem) {
  console.log(`Saving track ${currentTrack.trackName}.`);
  setFireStoreDoc(
    `users/${userId}/yesDeck/${currentTrack.trackId}`,
    currentTrack
  );
}

function previousTrack(
  currentTrack: DeckItem | null,
  nextTrackIndex: number,
  saveTrack: boolean
): DeckItem | null {
  console.log(
    `Track deck has ${sourceDeck.length} tracks. Getting the one at index ${nextTrackIndex}...`
  );
  if (currentTrack) {
    deleteFireStoreDoc(`users/${userId}/sourceDeck/${currentTrack.trackId}`);
    if (saveTrack)
      setFireStoreDoc(
        `users/${userId}/yesDeck/${currentTrack.trackId}`,
        currentTrack
      );
  }
  const trackIndex = nextTrackIndex % sourceDeck.length;
  return sourceDeck.length > 0 ? sourceDeck[trackIndex] : null;
}

function nextTrack(
  currentTrack: DeckItem | null,
  nextTrackIndex: number,
  saveTrack: boolean
): DeckItem | null {
  console.log(
    `Track deck has ${sourceDeck.length} tracks. Getting the one at index ${nextTrackIndex}...`
  );
  if (currentTrack) {
    deleteFireStoreDoc(`users/${userId}/sourceDeck/${currentTrack.trackId}`);
    if (saveTrack)
      setFireStoreDoc(
        `users/${userId}/yesDeck/${currentTrack.trackId}`,
        currentTrack
      );
  }
  const trackIndex = nextTrackIndex % sourceDeck.length;
  return sourceDeck.length > 0 ? sourceDeck[trackIndex] : null;
}

export {
  startDeckClient,
  stopDeckClient,
  getDeckItem,
  saveTrack,
  previousTrack,
  nextTrack,
  clearDeck,
};
