import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../state/store";
import { useDiscoverDestinationResource } from "../../utils/hooks";
import { postDiscoverDestination } from "../../client/client.api";
import FullComponentLoader from "../../loaders/components/FullComponentLoader";
import {
  DiscoverDestination,
  DiscoverDestinationData,
} from "../../client/client.model";
import { selectDiscoverDestination } from "../../state/slice.discoverdestination";
import "../styles/DiscoverDestinationPicker.scss";
import ActionSearch from "../../generic/components/ActionSearch";
import TabListGroup, {
  TabListItem,
} from "../../generic/components/TabListGroup";

interface Props {
  onDestinationSelected: () => void;
}

function TabListItemToDiscoverDestination(
  item: TabListItem
): DiscoverDestination {
  const discoverDestination: DiscoverDestination = {
    id: item.id,
    name: item.title,
    image: item.image,
  };
  return discoverDestination;
}

function DiscoverDestinationToTabListItem(
  item: DiscoverDestination
): TabListItem {
  const tabListItem: TabListItem = {
    id: item.id,
    title: item.name,
    image: item.image,
    group: "Playlists", //For now, all discover destinations are playlists.
  };

  return tabListItem;
}

function SearchFilterTabListItems(
  items: TabListItem[],
  searchText: string
): TabListItem[] {
  return items.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );
}

function DiscoverDestinationPicker({ onDestinationSelected }: Props) {
  const dispatch = useDispatch();
  const resourceStatus = useDiscoverDestinationResource();
  const discoverDestinationData = useSelector<
    StoreState,
    DiscoverDestinationData
  >((state) => state.discoverDestinationState.data);
  const [isLoading, setIsLoading] = useState(
    resourceStatus === "Loading" || resourceStatus === "Empty"
  ); //Also used as local loader for changing destination. May want to change this.
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  useEffect(
    () =>
      setIsLoading(resourceStatus === "Loading" || resourceStatus === "Empty"),
    [resourceStatus]
  );

  const onDestinationClick = useCallback(
    async (destination: DiscoverDestination, selected: boolean = false) => {
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

  const tabListItems = discoverDestinationData.availableDestinations.map(
    (destination) => DiscoverDestinationToTabListItem(destination)
  );

  return (
    <div className="destination-picker">
      {!isLoading && (
        <>
          <div className="top">
            <ActionSearch
              actionImage={"/src/assets/ic_close.png"}
              onAction={onDestinationSelected}
              onSearch={(text) => {
                setIsSearching(text.length > 0);
                setSearchText(text);
              }}
            />
          </div>
          {!isSearching && (
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
          )}
          {isSearching && (
            <TabListGroup
              items={SearchFilterTabListItems(tabListItems, searchText)}
              onClickItem={(item) => {
                onDestinationClick(TabListItemToDiscoverDestination(item));
              }}
            />
          )}
        </>
      )}
      {isLoading && <FullComponentLoader />}
    </div>
  );
}

export default DiscoverDestinationPicker;
