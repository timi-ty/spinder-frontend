import { LegacyRef, useEffect, useRef, useState } from "react";
import DiscoverTop from "./DiscoverTop";
import DiscoverDeckView from "./DiscoverDeckView";
import DiscoverBottom from "./DiscoverBottom";
import DiscoverSeeker from "./DiscoverSeeker";
import DiscoverDestinationPicker from "./DiscoverDestinationPicker";
import "../styles/Discover.scss";
import DiscoverSourcePicker from "./DiscoverSourcePicker";
import {
  useDeck,
  useDiscoverDestinationResource,
  useDiscoverSourceResource,
  useNoDocumentScroll,
  useWindowSize,
} from "../../utils/hooks";
import FullComponentLoader from "../../generic/components/FullComponentLoader";
import { nullTimeoutHandle } from "../../utils/utils";
import ErrorOneMessageTwoAction from "../../generic/components/ErrorOneMessageTwoAction";
import { resetSourceDeck } from "../../client/client.deck";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../state/store";
import { DiscoverSource } from "../../client/client.model";
import DiscoverBackgroundPanel from "./DiscoverBackgroundPanel";
import { InteractionPanelContext } from "../../utils/context";
import {
  setIsDestinationPickerOpen,
  setIsSourcePickerOpen,
} from "../../state/slice.globalui";

const waitForDeckMillis = 15000; //We wait for up to 15 seconds for the deck to be ready.

function Discover() {
  const dispatch = useDispatch();
  const [, windowHeight] = useWindowSize();

  const isDeckReady = useDeck(); //Add a loader until deck get ready.
  const isSelectingSource = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isSourcePickerOpen
  );
  const isSelectingDestination = useSelector<StoreState, boolean>(
    (state) => state.globalUIState.isDestinationPickerOpen
  );

  useNoDocumentScroll(!isSelectingSource && !isSelectingDestination);

  const timoutHandle = useRef(nullTimeoutHandle);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const currentSource = useSelector<StoreState, DiscoverSource>(
    (state) => state.discoverSourceState.data.selectedSource
  );

  useEffect(() => {
    if (timoutHandle.current) clearTimeout(timoutHandle.current); //Everytime the deck state changes, the timer is either discarded (if ready) or restarted (if unready)
    setIsTimedOut(false); //We always start by allowing the deck to load
    if (!isDeckReady) {
      timoutHandle.current = setTimeout(
        () => setIsTimedOut(true),
        waitForDeckMillis
      ); //Restart if unready
    }
    return () => {
      if (timoutHandle.current) clearTimeout(timoutHandle.current);
    };
  }, [isDeckReady, currentSource]); //If the source changes, we want to restart the timer and give it another 15 seconds to curate from the new source.

  const retrySourceDeck = () => {
    if (timoutHandle.current) {
      clearTimeout(timoutHandle.current);
    }
    setIsTimedOut(false);
    timoutHandle.current = setTimeout(
      () => setIsTimedOut(true),
      waitForDeckMillis
    ); //Restart the timer
    resetSourceDeck();
  };

  //We don't actually need these resources here but we start loading them here so that when we open the pickers, they can load faster or be already loaded.
  useDiscoverSourceResource();
  useDiscoverDestinationResource();

  const ineractionPanelRef: LegacyRef<HTMLDivElement> = useRef(null);

  return (
    <div className="discover" style={{ maxHeight: `${windowHeight}px` }}>
      <DiscoverBackgroundPanel ref={ineractionPanelRef} />
      <DiscoverTop
        onClickDestinationPicker={() =>
          dispatch(setIsDestinationPickerOpen(true))
        }
        onClickSourcePicker={() => dispatch(setIsSourcePickerOpen(true))}
      />
      <InteractionPanelContext.Provider value={ineractionPanelRef.current!}>
        {isDeckReady && <DiscoverDeckView />}
        {isDeckReady && <DiscoverBottom />}
      </InteractionPanelContext.Provider>
      {isDeckReady && <DiscoverSeeker />}
      {!isDeckReady && !isTimedOut && (
        <div className="deck-loader-error">
          <FullComponentLoader />
        </div>
      )}
      {!isDeckReady && isTimedOut && (
        <div className="deck-loader-error">
          <ErrorOneMessageTwoAction
            message={
              "We encountered a problem while curating your deck. If this error persists, please try a different source or reload the page."
            }
            actionOne={{
              name: "Retry",
              action: () => {
                retrySourceDeck();
              },
            }}
            actionTwo={{
              name: "Change Source",
              action: () => {
                dispatch(setIsSourcePickerOpen(true));
              },
            }}
          />
        </div>
      )}
      {isSelectingDestination && (
        <DiscoverDestinationPicker
          close={() => dispatch(setIsDestinationPickerOpen(false))}
        />
      )}
      {isSelectingSource && (
        <DiscoverSourcePicker
          close={() => dispatch(setIsSourcePickerOpen(false))}
        />
      )}
    </div>
  );
}

export default Discover;
