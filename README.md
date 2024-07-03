# Spindr - Music Discovery App: [Spindr.pro](https://spindr.pro/)

Welcome to Spindr! The ultimate music discovery application built with React.js! With Spindr, you can explore new music, manage your favorite tracks, and enjoy a seamless user experience powered by advanced React patterns and robust state management.

This is the frontend repo. Refer here for the backend repo [Spindr backend](https://github.com/timi-ty/spinder-backend).

## Features

- **Music Discovery:** Discover new tracks and artists effortlessly.
- **State Management with Redux:** Efficient and scalable state management.
- **Advanced React Patterns:** Utilizes custom hooks and higher-order components for enhanced functionality.
- **Custom Resource Management System:** Efficiently manages resources fetched through HTTP.
- **Gesture Management:** Smooth touch and mouse interactions.
- **Real-time Firestore Integration:** Keeps the music collection up-to-date.
- **Optimized Loading:** Minimized loading times with a custom swap chain system.

![spindrgifopt](https://github.com/timi-ty/spinder-frontend/assets/45536573/14f7dfe3-869f-4df1-a557-993db7cf89ab)

## Installation

To get started with Spindr, follow these steps:

```bash
git clone https://github.com/timi-ty/spinder-frontend.git
cd spinder-frontend
npm install
npm run dev
```

# Custom Resource Management System

Spindr uses a custom system to manage resources fetched through HTTP. This system ensures that resources are only loaded if they are not already available or currently loading, preventing unnecessary reloads and improving performance.

### Example: useAuthResource Hook

```javascript
function useAuthResource() {
  const authStatus = useSelector<StoreState, AuthStatus>((state) => state.authState.status);
  const authMode = useSelector<StoreState, AuthMode>((state) => state.authState.mode);
  
  useEffect(() => {
    if (authStatus !== "Empty") {
      console.log(`Already using Auth Resource:: Status: ${authStatus}`);
      return;
    }
    const unloadAuth = loadAuth();
    return () => unloadAuth();
  }, []);

  return { authStatus: authStatus, authMode: authMode };
}

function loadAuth() {
  dispatch(loadAuthResource());

  finalizeLogin()
    .then((userId) => {
      dispatch(loginAuthResource(userId));
      console.log(`Using Authentication for User:: ${userId}`);
    })
    .catch((error) => {
      if (error.status === 401) {
        dispatch(loadAuthResource());
        dispatch(setAuthMode("UnacceptedAnon"));
        anonymousLogin()
          .then((userId) => {
            dispatch(loginAuthResource(userId));
            console.log(`Using anon authentication for User:: ${userId}`);
          })
          .catch((error) => {
            console.error(error);
            dispatch(errorAuthResource());
            console.error("Failed to use anon authentication:: Error.");
          });
        console.warn("Failed to use full authentication:: Trying anonymous user mode...");
      } else {
        console.error(error);
        dispatch(errorAuthResource());
        console.error("Failed to use Authentication:: Error.");
      }
    });

  startRenewingAuthentication(55);

  return () => {
    dispatch(emptyAuthResource());
    stopRenewingAuthentication();
  };
}

export default useAuthResource;
```

## Custom Gesture Management Hooks

Spindr incorporates custom gesture management hooks to handle touch and mouse interactions smoothly.

### useTouchFlick Hook

```javascript
function useTouchFlick(
  onStartGesture: () => void,
  onFlick: (flickDelta: { dx: number; dy: number }) => void
) {
  const [isFlicking, setIsFlicking] = useState(false);
  const flickDeltaRef = useRef({ dx: 0, dy: 0 });
  const [flickDelta, setFlickDelta] = useState({ dx: 0, dy: 0 });
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [touchCurrentPos, setTouchCurrentPos] = useState({ x: 0, y: 0 });

  const onTouchStart = useCallback((ev: TouchEvent) => {
    setIsFlicking(true);
    const touch = ev.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY });
    onStartGesture();
    console.log(`Started Touch - x:${touch.clientX}, y:${touch.clientY}`);
  }, []);

  const onTouchMove = useCallback((ev: TouchEvent) => {
    const touch = ev.touches[0];
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY });
  }, []);

  const onTouchEndWindow = useCallback(() => {
    setIsFlicking(false);
    onFlick(flickDeltaRef.current);
    console.log(
      `Ending Touch Window - x:${flickDeltaRef.current.dx}, y:${flickDeltaRef.current.dy}`
    );
    setFlickDelta({ dx: 0, dy: 0 });
    flickDeltaRef.current = { dx: 0, dy: 0 };
  }, [onFlick]);

  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEndWindow);
    console.log("added listener");

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEndWindow);
      console.log("removed listener");
    };
  }, [onTouchStart, onTouchMove, onTouchEndWindow]);

  useEffect(() => {
    if (!isFlicking) return;
    const deltaX = touchCurrentPos.x - touchStartPos.x;
    const deltaY = touchCurrentPos.y - touchStartPos.y;
    setFlickDelta({ dx: deltaX, dy: deltaY });
    flickDeltaRef.current = { dx: deltaX, dy: deltaY };
  }, [touchStartPos, touchCurrentPos]);

  return flickDelta;
}

export default useTouchFlick;
```

## Real-time Firestore Integration

Spindr recomendations are piped to the frontend through Firestore events. Spindr uses a custom system to manage Firestore events with React hooks in order to preserve React's state management paradigm.

### Source deck client

```javascript
var userId: string;

//The source deck must be treated as a data store that gets fed from outside but never changes wrt to user interaction.
//This way, we don't break React's state management paradigm.
//The source deck grows indefinitely until the deck client is restarted. We can choose to address this.
//As a strict requirement for correct operation, the source deck can only be added to (increase in size) and never reduces in size. However, it can be emptied at once.
var sourceDeck: DeckItem[] = [];
var minSourceDeckSize = 3;

var unsubSourceDeckListener: () => void = () => {};

var onClearSourceDeck: () => void = () => {};

//Always use this method to modify the source deck to make sure that the modification alerts the UI.
var addSourceDeckItem: (item: DeckItem) => void = () => {};

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
      const bufferForShuffle: DeckItem[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          const track: DeckItem = change.doc.data() as DeckItem;
          bufferForShuffle.push(track);
        }
      });
      shuffleArrayInPlace(bufferForShuffle); //Non persistent front-end shuffling only.
      bufferForShuffle.forEach((deckItem) => {
        addSourceDeckItem(deckItem);
        console.log(`Adding source track: ${deckItem.trackName}`);
      });
    }
  );
}
```

### useDeck Hook

```javascript
function useDeck(): boolean {
  const dispatch = useDispatch();
  const userId = useSelector<StoreState, string>(
    (state) => state.authState.userId
  );
  const isDeckReady = useSelector<StoreState, boolean>(
    (state) => state.deckState.isSourceDeckReady
  );

  useEffect(() => {
    startSourceDeckClient(
      userId,
      () => {
        dispatch(setDeckReady(true));
      },
      () => {
        dispatch(setDeckReady(false));
      }
    );
    return () => {
      stopSourceDeckClient();
    };
  }, [userId]);

  return isDeckReady;
}

export default useDeck;
```

# Optimized Loading with Swap Chain

Spindr employs a swap chain system to ensure minimal loading times and a smooth user experience. Swap chain basically means while you're looking at something, more stuff is loading in invisible areas.

![swap-chain-optimize](https://github.com/timi-ty/spinder-frontend/assets/45536573/b82c1d68-859a-4bfd-9aef-96d9b0506b5e)

```javascript
function DiscoverDeckView() {
  const dispatch = useDispatch();
  //The Deck is a three item swap chain. We do this so that there's always a loaded item in front and behind the current one.
  const [activeDeckItemCursor, setActiveDeckItemCursor] = useState(0);
  const [cursor2, setCursor2] = useState(-1); //Starts behind the active
  const [cursor0, setCursor0] = useState(0); //Starts as the active
  const [cursor1, setCursor1] = useState(1); //Starts in front of the active

  const [isPlaying, setIsPlaying] = useState(false);

  //The jumping item is the item that will have to change it's absolute position behind the scenes without a transition.
  const [jumpingItemCursor, setJumpingItemCursor] = useState(-1);

  const deckItem0 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem0
  );
  useEffect(() => {
    const deckItem = getDeckItem(cursor0);
    dispatch(setDeckItem0(deckItem));
  }, [cursor0]);

  const deckItem1 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem1
  );
  useEffect(() => {
    const deckItem = getDeckItem(cursor1);
    dispatch(setDeckItem1(deckItem));
  }, [cursor1]);

  const deckItem2 = useSelector<StoreState, DeckItem>(
    (state) => state.deckState.deckItem2
  );
  useEffect(() => {
    const deckItem = getDeckItem(cursor2);
    dispatch(setDeckItem2(deckItem));
  }, [cursor2]);

  const activeDeckItem = useMemo(() => {
    return activeDeckItemCursor === 0
      ? deckItem0
      : activeDeckItemCursor === 1
      ? deckItem1
      : deckItem2;
  }, [activeDeckItemCursor]);

  useEffect(() => {
    dispatch(changeActiveDeckItem(activeDeckItemCursor));
  }, [activeDeckItemCursor]);

  const nextDeckItemView = useCallback(() => {
    markVisitedDeckItem(activeDeckItem); //Marks the currently displaying deck item as visited before going to the next one.
    switch (activeDeckItemCursor) {
      case 0:
        setCursor2((i) => i + 3); //We're moving cursors here to progress through the source deck in a swap chain manner.
        setActiveDeckItemCursor(1);
        setJumpingItemCursor(2); //If we go from 0 to 1, then 2 has to jump.
        break;
      case 1:
        setCursor0((i) => i + 3);
        setActiveDeckItemCursor(2);
        setJumpingItemCursor(0); //If we go from 1 to 2, then 0 has to jump.
        break;
      case 2:
        setCursor1((i) => i + 3);
        setActiveDeckItemCursor(0);
        setJumpingItemCursor(1); //If we go from 2 to 0, then 1 has to jump.
        break;
    }
    setIsPlaying(true);
  }, [activeDeckItemCursor, cursor0, cursor2]);

  const previousDeckItemView = useCallback(() => {
    switch (activeDeckItemCursor) {
      case 0:
        setCursor1((i) => i - 3);
        setActiveDeckItemCursor(2);
        setJumpingItemCursor(1); //If we go from 0 to 2, then 1 has to jump.
        break;
      case 1:
        setCursor2((i) => i - 3);
        setActiveDeckItemCursor(0);
        setJumpingItemCursor(2); //If we go from 1 to 0, then 2 has to jump.
        break;
      case 2:
        setCursor0((i) => i - 3);
        setActiveDeckItemCursor(1);
        setJumpingItemCursor(0); //If we go from 2 to 1, then 0 has to jump.
        break;
    }
    setIsPlaying(true);
  }, [activeDeckItemCursor, cursor0]);

  const getItemTop = (itemCursor: number) => {
    switch (activeDeckItemCursor) {
      case 0: //If 0 is active, 2 should be ontop of it and 1 below it.
        return itemCursor === 1
          ? viewHeight + remToPx(0.5) //Half rem gap
          : itemCursor === 2
          ? -(viewHeight + remToPx(0.5))
          : 0;
      case 1: //If 1 is active, 0 should be ontop of it and 2 below it.
        return itemCursor === 0
          ? -(viewHeight + remToPx(0.5))
          : itemCursor === 2
          ? viewHeight + remToPx(0.5)
          : 0;
      case 2: //If 2 is active, 1 should be ontop of it and 0 below it.
        return itemCursor === 0
          ? viewHeight + remToPx(0.5)
          : itemCursor === 1
          ? -(viewHeight + remToPx(0.5))
          : 0;
      default:
        return 0;
    }
  };

  //In order not to reload the image and audio fed into DeckItemView, we only need to makesure that the value passed into mDeckItem does not change until we've used it.
  return (
    <div className={styles.deck}>
      <div ref={containerRef} className={styles.deckItemsContainer}>
        <DiscoverDeckItemView
          deckItemViewIndex={0}
          mDeckItem={deckItem0}
          isPlaying={isPlaying && activeDeckItemCursor === 0}
          verticalTranslation={getItemTop(0) + verticalTranslation}
          transitionTranslate={transitionTranslate && jumpingItemCursor !== 0}
        />

        <DiscoverDeckItemView
          deckItemViewIndex={1}
          mDeckItem={deckItem1}
          isPlaying={isPlaying && activeDeckItemCursor === 1}
          verticalTranslation={getItemTop(1) + verticalTranslation}
          transitionTranslate={transitionTranslate && jumpingItemCursor !== 1}
        />

        <DiscoverDeckItemView
          deckItemViewIndex={2}
          mDeckItem={deckItem2}
          isPlaying={isPlaying && activeDeckItemCursor === 2}
          verticalTranslation={getItemTop(2) + verticalTranslation}
          transitionTranslate={transitionTranslate && jumpingItemCursor !== 2}
        />
      </div>
    </div>
  );
}

export default DiscoverDeckView;
```
# Spindr

Enjoy discovering new music with Spindr, and feel free to contribute to the project on [GitHub](https://github.com/timi-ty/spinder-frontend.git).

## License
Spindr is licensed under the GPL License. See the [LICENSE](LICENSE) file for more details.

## Contact
For questions, suggestions, or contributions, please contact [timilehin.ty@gmail.com](timilehin.ty@gmail.com).
