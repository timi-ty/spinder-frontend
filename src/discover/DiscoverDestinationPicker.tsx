import { useCallback, useState } from "react";
import { useDiscoverDestinations } from "../utils/hooks";
import "./DiscoverDestinationPicker.scss";
import { postDiscoverDestination } from "../client/client.api";
import FullScreenLoader from "../loaders/FullScreenLoader";

interface Props {
  onDestinationSelected: () => void;
}

function DiscoverDestinationPicker({ onDestinationSelected }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("");
  const discoverDestinations = useDiscoverDestinations(setSelectedDestination); //TODO: This is unnacceptable. Use a global state manager to avoid doing stuff like this.
  const onDestinationClick = useCallback(
    async (id: string, selected: boolean) => {
      if (!selected) {
        setIsLoading(true);
        try {
          const response = await postDiscoverDestination(id);
          setSelectedDestination(response.selectedDestinationId);
          onDestinationSelected();
          setIsLoading(false);
        } catch (error) {
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
            {discoverDestinations.discoverDestinationPlaylists.map(
              (playlist) => {
                const selected = playlist.id === selectedDestination;
                return (
                  <div
                    className={`option-item ${selected ? "selected" : ""}`}
                    onClick={() => onDestinationClick(playlist.id, selected)}
                  >
                    <div className="text">{playlist.name}</div>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
      {isLoading && <FullScreenLoader />}
    </div>
  );
}

export default DiscoverDestinationPicker;
