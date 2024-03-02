import { useEffect, useRef, useState } from "react";
import DiscoverTop from "./DiscoverTop";
import DiscoverDeckView from "./DiscoverDeckView";
import DiscoverBottom from "./DiscoverBottom";
import DiscoverSeeker from "./DiscoverSeeker";
import DiscoverDestinationPicker from "./DiscoverDestinationPicker";
import "../styles/Discover.scss";
import DiscoverSourcePicker from "./DiscoverSourcePicker";
import DiscoverMiddle from "./DiscoverMiddle";
import {
  useDeck,
  useDiscoverDestinationResource,
  useDiscoverSourceResource,
} from "../../utils/hooks";
import FullComponentLoader from "../../generic/components/FullComponentLoader";
import { nullTimeoutHandle } from "../../utils/utils";
import ErrorOneMessageTwoAction from "../../generic/components/ErrorOneMessageTwoAction";
import { resetSourceDeck } from "../../client/client.deck";
import { useSelector } from "react-redux";
import { StoreState } from "../../state/store";
import { DiscoverSource } from "../../client/client.model";

const waitForDeckMillis = 15000; //We wait for up to 15 seconds for the deck to be ready.

function Discover() {
  const isDeckReady = useDeck(); //Add a loader until deck get ready.
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const [isSelectingSource, setIsSelectingSource] = useState(false);

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
    <div className="discover">
      <DiscoverTop
        onClickDestinationPicker={() => setIsSelectingDestination(true)}
        onClickSourcePicker={() => setIsSelectingSource(true)}
      />
      {isDeckReady && <DiscoverDeckView />}
      {isDeckReady && <DiscoverMiddle />}
      {isDeckReady && <DiscoverBottom />}
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
              "We encountered a problem while curating your deck. If this error persists, please try a different source."
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
                setIsSelectingSource(true);
              },
            }}
          />
        </div>
      )}
      {isSelectingDestination && (
        <DiscoverDestinationPicker
          close={() => setIsSelectingDestination(false)}
        />
      )}
      {isSelectingSource && (
        <DiscoverSourcePicker close={() => setIsSelectingSource(false)} />
      )}
    </div>
  );
}

export default Discover;
