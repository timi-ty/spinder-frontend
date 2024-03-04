import { nullTimeoutHandle } from "../utils/utils";
import {
  changeDiscoverDestination,
  changeDiscoverSource,
  refillDiscoverSourceDeck,
  removeFromDestination,
  resetDiscoverDestinationDeck,
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
//As a strict requirement for correct operation, the source deck can only be added to (increase in size) and never reduces in size. However, it can be emptied at once.
var sourceDeck: DeckItem[] = [];
var minSourceDeckSize = 3;
//The destination deck gets updated on user interaction but does not break the application state for the following reasons:
//1. It is a Set which means repeated removals and repeated additions amount to a single operation meaning it is not broken by re-renders.
//2. We can hook up state updates to it even though it is not by itself part of the UI state.
var destinationDeck: Set<string> = new Set(); //The destination deck has only the track ids.

var unsubSourceDeckListener: () => void = () => {};
var unsubDestinationDeckListener: () => void = () => {};

var onClearSourceDeck: () => void = () => {};
var onClearDestinationDeck: () => void = () => {};

//Always use this method to modify the source deck to make sure that the modification alerts the UI.
var addSourceDeckItem: (item: DeckItem) => void = () => {};

//Always use these method to moify the destination deck set to makesure that modifications alert the UI.
var addDestinationDeckItem: (itemId: string) => void = () => {};
var removeDestinationDeckItem: (itemId: string) => void = () => {};

//Start deck client is called from react and we must ensure that every time it is called, the result is the same. Source deck is re-initialized on every call.
function startSourceDeckClient(
  clientId: string,
  onSourceDeckReady: () => void,
  onSourceDeckUnready: () => void
) {
  console.log("Starting source deck client...");
  userId = clientId; //After starting the deck client, the userId becomes a globally available variable for saving and other operations.
  onClearSourceDeck = onSourceDeckUnready; //Mark the tracks as not ready everytime the deck is cleared.

  addSourceDeckItem = (item) => {
    sourceDeck.push(item);
    if (sourceDeck.length >= minSourceDeckSize) {
      onSourceDeckReady(); //There are at least minSourceDeckSize tracks ready to be used.
    }
  };

  resetSourceDeck();

  //Listen to source deck.
  unsubSourceDeckListener = listenToFirestoreCollection(
    `users/${clientId}/sourceDeck`,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          const track: DeckItem = change.doc.data() as DeckItem;
          addSourceDeckItem(track);
        }
      });
    }
  );
}

//Start deck client is called from react and we must ensure that every time it is called, the result is the same. Destination deck is re-initialized on every call.
function startDestinationDeckClient(
  clientId: string,
  onAddDeckItem: () => void,
  onRemoveDeckItem: () => void,
  onClearDeck: () => void
) {
  console.log("Starting destination deck client...");
  onClearDestinationDeck = onClearDeck;

  clearDestinationDeck(); // Re-initialize destination deck.

  addDestinationDeckItem = (itemId) => {
    destinationDeck.add(itemId);
    onAddDeckItem();
  };
  removeDestinationDeckItem = (itemId) => {
    destinationDeck.delete(itemId);
    onRemoveDeckItem();
  };

  //Listen to destination deck.
  //Unlinke source deck, destination deck is allowed to be empty which means there is really no way to differentiate between an error that prevents the deck from filling and an empty deck. This is an infra problem, not fixing for now.
  //The effect of this problem is that the liked feature may work only partially sometimes. It means that items previously in the destination can be added again.
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

function resetSourceDeck() {
  clearSourceDeck(); // Re-initialize source deck.
  refillDiscoverSourceDeck(); //A promise that we don't have to wait for because of firestore web sockets.
}

//The only reason to ever use this API is if we want to keep liked items up to date with items that were added outside of Spinder, or if we encounter an error an want to retry. We don't currently do either of these.
function resetDestinationDeck() {
  clearDestinationDeck(); // Re-initialize destination deck before refreshing it. We don't want to mix stale items with new items here.
  resetDiscoverDestinationDeck(); //A promise that we don't have to wait for because of firestore web sockets.
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
  if (index > sourceDeck.length - 20) {
    //Attempt a refill if we have fewer than 20 fresh items ahead of us.
    refillSourceDeckManaged();
  }
  index %= sourceDeck.length; //Go round and round. Never let the user know that the deck is stale.
  const deckItem = sourceDeck[index];
  return deckItem;
}

//Managing the refill to prevent it being called too much.
var canRefillEvery = 20000; //Can refill every 20 seconds.
var lastRefillTimeoutHandle = nullTimeoutHandle;
var canRefill = true;
function refillSourceDeckManaged() {
  if (!canRefill) return;
  canRefill = false;
  refillDiscoverSourceDeck();
  if (lastRefillTimeoutHandle) clearTimeout(lastRefillTimeoutHandle);
  lastRefillTimeoutHandle = setTimeout(() => {
    canRefill = true;
  }, canRefillEvery);
}

function markVisitedDeckItem(currentDeckItem: DeckItem) {
  deleteFireStoreDoc(`users/${userId}/sourceDeck/${currentDeckItem.trackId}`); //Delete the deck item as soon as it is visited. This keeps the deck experience fresh evrytime.
}

function saveDeckItem(
  currentDeckItem: DeckItem,
  onSuccess: () => void,
  onFailure: () => void
) {
  console.log(`Saving deck item:: ${currentDeckItem.trackName}.`);
  addDestinationDeckItem(currentDeckItem.trackId); //Locally track deck items we expect to reach our destination.
  saveToDestination(currentDeckItem)
    .then(() => {
      onSuccess();
    })
    .catch(() => {
      onFailure();
      removeDestinationDeckItem(currentDeckItem.trackId); //The item failed to reach our destination. Delete it.
    });
}

function unsaveDeckItem(
  currentDeckItem: DeckItem,
  onSuccess: () => void,
  onFailure: () => void
) {
  console.log(`Unsaving deck item:: ${currentDeckItem.trackName}.`);
  removeDestinationDeckItem(currentDeckItem.trackId); //Locally track deck items we expect to reach our destination.
  removeFromDestination(currentDeckItem)
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

function changeSource(
  source: DiscoverSource,
  onSourceChanged: (newSource: DiscoverSource) => void,
  onError: () => void
) {
  clearSourceDeck(); //We need to cache the entire source deck here and restore it if we fail.
  changeDiscoverSource(source)
    .then((currentSource) => onSourceChanged(currentSource))
    .catch((error) => {
      console.error(error);
      onError();
    });
}

function changeDestination(
  destination: DiscoverDestination,
  onDestinationChanged: (newDestination: DiscoverDestination) => void,
  onError: () => void
) {
  clearDestinationDeck(); //We need to cache the entire destination deck here and restore it if we fail.
  changeDiscoverDestination(destination)
    .then((currentDestination) => onDestinationChanged(currentDestination))
    .catch((error) => {
      console.error(error);
      onError();
    });
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
  resetSourceDeck,
  resetDestinationDeck,
  changeSource,
  changeDestination,
};
