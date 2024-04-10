import { memo, useEffect, useRef, useState } from "react";
import DiscoverTop from "./DiscoverTop";
import DiscoverDeckView from "./DiscoverDeckView";
import DiscoverBottom from "./DiscoverBottom";
import DiscoverSeeker from "./DiscoverSeeker";
import DiscoverDestinationPicker from "./DiscoverDestinationPicker";
import "../styles/Discover.scss";
import DiscoverSourcePicker from "./DiscoverSourcePicker";
import FullComponentLoader from "../../generic/components/FullComponentLoader";
import { nullTimeoutHandle } from "../../utils";
import ErrorOneMessageTwoAction from "../../generic/components/ErrorOneMessageTwoAction";
import { resetSourceDeck } from "../../client/client.deck";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../state/store";
import { DiscoverSource } from "../../client/client.model";
import {
  setIsDestinationPickerOpen,
  setIsSourcePickerOpen,
} from "../../state/slice.globalui";
import DiscoverBackgroundProvider from "./DiscoverBackgroundPanel";
import useDiscoverDestinationResource from "../../resource-hooks/useDiscoverDestinationResource";
import useDiscoverSourceResource from "../../resource-hooks/useDiscoverSourceResource";
import useDeck from "../../utility-hooks/useDeck";
import useNoDocumentScroll from "../../utility-hooks/useNoDocumentScroll";
import useWindowSize from "../../utility-hooks/useWindowSize";

const waitForDeckMillis = 15000; //We wait for up to 15 seconds for the deck to be ready.

const Discover = memo(function Discover() {
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

  return (
    <div className="discover" style={{ maxHeight: `${windowHeight}px` }}>
      <DiscoverBackgroundProvider>
        <DiscoverTop
          onClickDestinationPicker={() =>
            dispatch(setIsDestinationPickerOpen(true))
          }
          onClickSourcePicker={() => dispatch(setIsSourcePickerOpen(true))}
        />
        {isDeckReady && <DiscoverDeckView />}
        {isDeckReady && <DiscoverBottom />}
        {isDeckReady && <DiscoverSeeker />}
      </DiscoverBackgroundProvider>
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
});

export default Discover;
