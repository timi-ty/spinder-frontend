import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startSourceDeckClient,
  stopSourceDeckClient,
  startDestinationDeckClient,
  stopDestinationDeckClient,
} from "../client/client.deck";
import {
  setDeckReady,
  addDestinationDeckItem,
  removeDestinationDeckItem,
  clearDestinationDeck,
} from "../state/slice.deck";
import { StoreState } from "../state/store";

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

  useEffect(() => {
    startDestinationDeckClient(
      userId,
      () => {
        dispatch(addDestinationDeckItem());
      },
      () => {
        dispatch(removeDestinationDeckItem());
      },
      () => {
        dispatch(clearDestinationDeck());
      }
    );
    return () => {
      stopDestinationDeckClient();
    };
  }, [userId]);

  return isDeckReady;
}

export default useDeck;
