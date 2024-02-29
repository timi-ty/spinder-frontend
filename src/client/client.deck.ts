import {
  refreshDestinationDeck,
  refreshSourceDeck,
  removeFromDestination,
  saveToDestination,
} from "./client.api";
import {
  deleteFireStoreDoc,
  listenToFirestoreCollection,
} from "./client.firebase";
import { DeckItem, DiscoverDestination, DiscoverSource } from "./client.model";

var userId: string;

//The source deck must be treated as a data store that gets fed from outside but never changes wrt to user interaction.
//This way, we don't break React's state management paradigm.
//The source deck grows indefinitely until the deck client is restarted. We can choose to address this.
var sourceDeck: DeckItem[] = [];
//The destination deck gets updated on user interaction but does not break the application state for the following reasons:
//1. It is a Set which means repeated removals and repeated additions amount to a single operation meaning it is not broken by re-renders.
//2. It is silent. It is never supposed to and will never trigger a re-render on it's own. The UI chooses when to check it to decide what to render.
var destinationDeck: Set<string> = new Set(); //The destination deck has only the track ids.
var unsubSourceDeckListener: () => void = () => {};
var unsubDestinationDeckListener: () => void = () => {};
var onClearSourceDeck: () => void = () => {};
var onClearDestinationDeck: () => void = () => {};

var addDestinationDeckItem: (itemId: string) => void = () => {};
var removeDestinationDeckItem: (itemId: string) => void = () => {};

//Start deck client is called from react and we must ensure that every time it is called, the result is the same. Source deck is re-initialized on every call.
function startSourceDeckClient(
  clientId: string,
  source: DiscoverSource,
  onSourceDeckReady: () => void,
  onSourceDeckUnready: () => void,
  minSourceDeckSize = 3
) {
  console.log("Starting source deck client...");
  userId = clientId; //After starting the deck client, the userId becomes a globally available variable for saving and other operations.
  onClearSourceDeck = onSourceDeckUnready; //Mark the tracks as not ready everytime the deck is cleared.

  clearSourceDeck(); // Re-initialize source deck.
  refreshSourceDeck(source); //A promise that we don't have to wait for because of firestore web sockets.

  //Listen to source deck.
  unsubSourceDeckListener = listenToFirestoreCollection(
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
}

//Start deck client is called from react and we must ensure that every time it is called, the result is the same. Destination deck is re-initialized on every call.
function startDestinationDeckClient(
  clientId: string,
  destination: DiscoverDestination,
  onAddDeckItem: () => void,
  onRemoveDeckItem: () => void,
  onClearDeck: () => void
) {
  console.log("Starting destination deck client...");
  userId = clientId; //After starting the deck client, the userId becomes a globally available variable for saving and other operations.
  onClearDestinationDeck = onClearDeck;

  clearDestinationDeck(); // Re-initialize destination deck.
  refreshDestinationDeck(destination); //A promise that we don't have to wait for because of firestore web sockets.

  addDestinationDeckItem = (itemId) => {
    destinationDeck.add(itemId);
    onAddDeckItem();
  };
  removeDestinationDeckItem = (itemId) => {
    destinationDeck.delete(itemId);
    onRemoveDeckItem();
  };

  //Listen to destination deck.
  unsubDestinationDeckListener = listenToFirestoreCollection(
    `users/${clientId}/destinationDeck`,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          addDestinationDeckItem(change.doc.id);
        }
        if (change.type == "removed") {
          removeDestinationDeckItem(change.doc.id);
        }
      });
    }
  );
}

function stopSourceDeckClient() {
  console.log("Stopping source deck client...");
  unsubSourceDeckListener();
  clearSourceDeck();
}

function stopDestinationDeckClient() {
  console.log("Stopping destination deck client...");
  unsubDestinationDeckListener();
  clearDestinationDeck();
}

function clearSourceDeck() {
  sourceDeck = [];
  onClearSourceDeck();
}

function clearDestinationDeck() {
  destinationDeck.clear();
  onClearDestinationDeck();
}

function getDeckItem(index: number): DeckItem {
  if (index >= sourceDeck.length)
    throw new Error(
      `Source deck of size ${sourceDeck.length} does not have an item at index ${index}.`
    );
  const deckItem = sourceDeck[index];
  return deckItem;
}

function markVisitedDeckItem(currentDeckItem: DeckItem) {
  deleteFireStoreDoc(`users/${userId}/sourceDeck/${currentDeckItem.trackId}`); //Delete the deck item as soon as it is visited. This keeps the deck experience fresh evrytime.
}

function saveDeckItem(
  destination: DiscoverDestination,
  currentDeckItem: DeckItem,
  onSuccess: () => void,
  onFailure: () => void
) {
  console.log(`Saving deck item:: ${currentDeckItem.trackName}.`);
  addDestinationDeckItem(currentDeckItem.trackId); //Locally track deck items we expect to reach our destination.
  saveToDestination(destination, currentDeckItem)
    .then(() => {
      onSuccess();
    })
    .catch(() => {
      onFailure();
      removeDestinationDeckItem(currentDeckItem.trackId); //The item failed to reach our destination. Delete it.
    });
}

function unsaveDeckItem(
  destination: DiscoverDestination,
  currentDeckItem: DeckItem,
  onSuccess: () => void,
  onFailure: () => void
) {
  console.log(`Unsaving deck item:: ${currentDeckItem.trackName}.`);
  removeDestinationDeckItem(currentDeckItem.trackId); //Locally track deck items we expect to reach our destination.
  removeFromDestination(destination, currentDeckItem)
    .then(() => {
      onSuccess();
    })
    .catch(() => {
      onFailure();
      addDestinationDeckItem(currentDeckItem.trackId); //The item failed to reach our destination. Delete it.
    });
}

//This method works for deck items the user just saved as well as deck items that were already in the user's destination even before ever using Spinder.
function isDeckItemSaved(currentTrack: DeckItem) {
  return destinationDeck.has(currentTrack.trackId);
}

export {
  startSourceDeckClient,
  startDestinationDeckClient,
  stopSourceDeckClient,
  stopDestinationDeckClient,
  getDeckItem,
  markVisitedDeckItem,
  saveDeckItem,
  unsaveDeckItem,
  isDeckItemSaved,
  clearSourceDeck,
  clearDestinationDeck,
};
