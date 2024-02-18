import { useCallback, useState } from "react";
import { useDiscoverDestinationResource } from "../utils/hooks";
import "./DiscoverDestinationPicker.scss";
import { postDiscoverDestination } from "../client/client.api";
import FullComponentLoader from "../loaders/FullComponentLoader";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../state/store";
import {
  DiscoverDestination,
  DiscoverDestinationData,
} from "../client/client.model";
import { selectDiscoverDestination } from "../state/slice.discoverdestination";

interface Props {
  onDestinationSelected: () => void;
}

function DiscoverDestinationPicker({ onDestinationSelected }: Props) {
  const dispatch = useDispatch();
  const resourceStatus = useDiscoverDestinationResource();
  const discoverDestinationData = useSelector<
    StoreState,
    DiscoverDestinationData
  >((state) => state.discoverDestinationState.data);
  const [isLoading, setIsLoading] = useState(resourceStatus === "Loading"); //Also used as local loader for changing destination. May want to change this.

  const onDestinationClick = useCallback(
    async (destination: DiscoverDestination, selected: boolean) => {
      if (!selected) {
        setIsLoading(true);
        try {
          const response = await postDiscoverDestination(destination);
          if (response.id === destination.id) {
            dispatch(selectDiscoverDestination(destination));
            onDestinationSelected();
            setIsLoading(false);
            return;
          }
          throw new Error(
            `Discover destination set mismatch. Asked for ${destination.id} but got ${response.id}.`
          );
        } catch (error) {
          console.error(error);
          console.error("Failed to set discover desination.");
          setIsLoading(false);
        }
      }
    },
    []
  );

  return (
    <div className="destination-picker">
      {!isLoading && (
        <>
          <div className="top">
            <button onClick={onDestinationSelected}>
              <img className="icon-btn" src="./src/assets/ic_close.png" />
            </button>
            <input className="search" type="search" />
          </div>
          <div className="option-grid">
            {discoverDestinationData.availableDestinations.map(
              (destination) => {
                const selected =
                  destination.id ===
                  discoverDestinationData.selectedDestination.id;
                return (
                  <div
                    key={destination.id}
                    className={`option-item ${selected ? "selected" : ""}`}
                    onClick={() => onDestinationClick(destination, selected)}
                  >
                    <div className="text">{destination.name}</div>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
      {isLoading && <FullComponentLoader />}
    </div>
  );
}

export default DiscoverDestinationPicker;
