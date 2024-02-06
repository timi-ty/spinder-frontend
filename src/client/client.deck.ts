import {
  deleteFireStoreDoc,
  listenToFirestoreCollection,
  setFireStoreDoc,
} from "./client.firebase";
import { DeckItem } from "./client.model";

var userId: string;

//Track deck must be treated as a data store that gets fed from outside but never changes wrt to user interaction.
//This way, we don't break React's state management paradigm.
var trackDeck: DeckItem[];
var unsub: () => void;

//Start deck client is called from react and we must ensure that every time it is called, the result is the same. Track deck is re-initialized on every call.
function startDeckClient(clientId: string, onTracksReady: () => void) {
  console.log("Starting deck client...");
  userId = clientId;
  trackDeck = [];
  unsub = listenToFirestoreCollection(
    `users/${clientId}/sourceDeck`,
    (snapshot) => {
      snapshot.docChanges().forEach((change, index) => {
        if (change.type == "added") {
          const track: DeckItem = change.doc.data() as DeckItem;
          trackDeck.push(track);

          if (index >= 1) {
            onTracksReady(); //There are at least two tracks ready to be used.
          }
        }
      });
    }
  );
}

function stopDeckClient() {
  console.log("Stopping deck client...");
  unsub();
}

function nextTrack(
  currentTrack: DeckItem | null,
  nextTrackIndex: number,
  saveTrack: boolean
): DeckItem | null {
  console.log(
    `Track deck has ${trackDeck.length} tracks. Getting the one at index ${nextTrackIndex}...`
  );
  if (currentTrack) {
    deleteFireStoreDoc(`users/${userId}/sourceDeck/${currentTrack.trackId}`);
    if (saveTrack)
      setFireStoreDoc(
        `users/${userId}/yesDeck/${currentTrack.trackId}`,
        currentTrack
      );
  }
  const trackIndex = nextTrackIndex % trackDeck.length;
  return trackDeck.length > 0 ? trackDeck[trackIndex] : null;
}

export { startDeckClient, stopDeckClient, nextTrack };
