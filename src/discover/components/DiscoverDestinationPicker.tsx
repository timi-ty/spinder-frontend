import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../state/store";
import { useDiscoverDestinationResource } from "../../utils/hooks";
import FullComponentLoader from "../../generic/components/FullComponentLoader";
import {
  DiscoverDestination,
  DiscoverDestinationData,
} from "../../client/client.model";
import { selectDiscoverDestination } from "../../state/slice.discoverdestination";
import "../styles/DiscoverDestinationPicker.scss";
import SearchArea from "../../generic/components/SearchArea";
import TabListGroup, {
  TabListItem,
} from "../../generic/components/TabListGroup";
import BalancedGrid, {
  BalancedGridItem,
} from "../../generic/components/BalancedGrid";
import TitleBar from "../../generic/components/TitleBar";
import { changeDestination } from "../../client/client.deck";
import EmptyView from "../../generic/components/EmptyView";

interface Props {
  close: () => void;
}

interface DiscoverDestinationItem
  extends DiscoverDestination,
    TabListItem,
    BalancedGridItem {}

function DiscoverDestinationToItem(
  item: DiscoverDestination
): DiscoverDestinationItem {
  const destinationItem: DiscoverDestinationItem = {
    id: item.id,
    name: item.name,
    title: item.name,
    image: item.image,
    group: item.isFavourites ? "Favourites" : "Playlists",
    isFavourites: item.isFavourites,
  };

  return destinationItem;
}

function ItemToDiscoverDestination(
  item: DiscoverDestinationItem
): DiscoverDestination {
  const destination: DiscoverDestination = {
    id: item.id,
    name: item.name,
    image: item.image,
    isFavourites: item.isFavourites,
  };

  return destination;
}

function SearchFilterItems(
  items: DiscoverDestinationItem[],
  searchText: string
): DiscoverDestinationItem[] {
  return items.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );
}

function DiscoverDestinationPicker({ close }: Props) {
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
    async (
      destination: DiscoverDestinationItem,
      isSelected: boolean = false
    ) => {
      if (!isSelected) {
        setIsLoading(true);
        changeDestination(
          ItemToDiscoverDestination(destination),
          (newDestination) => {
            dispatch(selectDiscoverDestination(newDestination));
            close();
            setIsLoading(false);
          },
          () => {
            /*Show error, failed to change destination.*/
            setIsLoading(false);
          }
        );
      }
    },
    []
  );

  const destinationItems = useMemo(
    () =>
      discoverDestinationData.availableDestinations.map((destination) =>
        DiscoverDestinationToItem(destination)
      ),
    [discoverDestinationData]
  );
  const selectedDestinationItem = useMemo(
    () =>
      DiscoverDestinationToItem(discoverDestinationData.selectedDestination),
    [discoverDestinationData]
  );

  const searchResults = useMemo(
    () => SearchFilterItems(destinationItems, searchText),
    [destinationItems, searchText]
  );

  return (
    <div className="destination-picker">
      {!isLoading && (
        <>
          <div className="title">
            <TitleBar title={"Destination"} onClose={() => close()} />
          </div>
          <div className="search">
            <SearchArea
              onSearch={(text) => {
                setSearchText(text);
              }}
              onTextChanged={(text) => {
                setIsSearching(text.length > 0);
              }}
              hint={"Search your playlists"}
              millisToSettle={10}
              isLoading={false} //The load time here is always too small to matter.
            />
          </div>
          <div className="bottom">
            {!isSearching && (
              <BalancedGrid
                items={destinationItems}
                onClickItem={onDestinationClick}
                selectedItem={selectedDestinationItem}
                graphicType={"Image"}
                showSelectedItem={true}
              />
            )}
            {isSearching && searchResults.length > 0 && (
              <TabListGroup
                items={searchResults}
                onClickItem={onDestinationClick}
                selectedItem={selectedDestinationItem}
                useRoundedImage={() => true}
              />
            )}
            {isSearching && searchResults.length === 0 && (
              <div className="loader-empty">
                <EmptyView />
              </div>
            )}
          </div>
        </>
      )}
      {isLoading && (
        <div className="loader-full-page">
          <FullComponentLoader />
        </div>
      )}
    </div>
  );
}

export default DiscoverDestinationPicker;
