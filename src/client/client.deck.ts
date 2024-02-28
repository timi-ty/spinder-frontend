import { refreshDeck } from "./client.api";
import {
  deleteFireStoreDoc,
  listenToFirestoreCollection,
  setFireStoreDoc,
} from "./client.firebase";
import { DeckItem } from "./client.model";

var userId: string;

//The source deck must be treated as a data store that gets fed from outside but never changes wrt to user interaction.
//This way, we don't break React's state management paradigm.
//The source deck grows indefinitely until the deck client is restarted. We can choose to address this.
var sourceDeck: DeckItem[] = [];
//The destination deck gets updated on user interaction but does not break the application state for the following reasons:
//1. It is a Set which means repeated removals and repeated additions amount to a single operation meaning it is not broken by re-renders.
//2. It is silent. It is never supposed to and will never trigger a re-render on it's own. The UI chooses when to check it to decide what to render.
var destDeck: Set<string> = new Set(); //The destination deck has only the track ids.
var unsubSource: () => void = () => {};
var unsubDest: () => void = () => {};
var onClearSourceDeck: () => void = () => {};

//Start deck client is called from react and we must ensure that every time it is called, the result is the same. Track deck is re-initialized on every call.
function startDeckClient(
  clientId: string,
  onSourceDeckReady: () => void,
  onSourceDeckUnready: () => void,
  minSourceDeckSize = 3
) {
  console.log("Starting deck client...");
  userId = clientId; //After starting the deck client, the userId becomes a globally available variable for saving and other operations.
  onClearSourceDeck = onSourceDeckUnready; //Mark the tracks as not ready everytime the deck is cleared.
  clearSourceDeck();
  refreshDeck(); //A promise that we don't have to wait for because of firestore web sockets.

  //Listen to source deck.
  unsubSource = listenToFirestoreCollection(
    `users/${clientId}/sourceDeck`,
    (snapshot) => {
      snapshot.docChanges().forEach((change, index) => {
        if (change.type == "added") {
          const track: DeckItem = change.doc.data() as DeckItem;
          sourceDeck.push(track);

          if (index >= minSourceDeckSize - 1) {
            onSourceDeckReady(); //There are at least minSourceDeckSize tracks ready to be used.
          }
        }
      });
    }
  );

  clearDestinationDeck();

  //Listen to destination deck.
  unsubDest = listenToFirestoreCollection(
    `users/${clientId}/destinationDeck`,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          destDeck.add(change.doc.id);
        }
        if (change.type == "removed") {
          destDeck.delete(change.doc.id);
        }
      });
    }
  );
}

function stopDeckClient() {
  console.log("Stopping deck client...");
  unsubSource();
  unsubDest();
  clearSourceDeck();
  clearDestinationDeck();
}

function clearSourceDeck() {
  sourceDeck = [];
  onClearSourceDeck();
}

function clearDestinationDeck() {
  destDeck.clear();
}

function getDeckItem(index: number): DeckItem {
  if (index >= sourceDeck.length)
    throw new Error(
      `Source deck of size ${sourceDeck.length} does not have an item at index ${index}.`
    );
  const deckItem = sourceDeck[index];
  deleteFireStoreDoc(`users/${userId}/sourceDeck/${deckItem.trackId}`); //Delete the deck item as soon as it is visited. This keeps the deck experience fresh evrytime.
  return deckItem;
}

function saveDeckItem(
  currentDeckItem: DeckItem,
  onSuccess: () => void,
  onFailure: () => void
) {
  console.log(`Saving deck item ${currentDeckItem.trackName}.`);
  destDeck.add(currentDeckItem.trackId); //Locally track deck items we expect to reach our destination.
  setFireStoreDoc(
    `users/${userId}/yesDeck/${currentDeckItem.trackId}`,
    currentDeckItem
  )
    .then(() => {
      onSuccess();
    })
    .catch(() => {
      onFailure();
      destDeck.delete(currentDeckItem.trackId); //The item failed to reach our destination. Delete it.
    });
}

//This method works for deck items the user just saved as well as deck items that were already in the user's destination even before ever using Spinder.
function isDeckItemSaved(currentTrack: DeckItem) {
  return destDeck.has(currentTrack.trackId);
}

export {
  startDeckClient,
  stopDeckClient,
  getDeckItem,
  saveDeckItem,
  isDeckItemSaved,
  clearSourceDeck,
  clearDestinationDeck,
};
