import { useCallback, useEffect, useMemo, useState } from "react";
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
import SearchArea from "../../generic/components/SearchArea";
import TabListGroup, {
  TabListItem,
} from "../../generic/components/TabListGroup";
import BalancedGrid, {
  BalancedGridItem,
} from "../../generic/components/BalancedGrid";
import TitleBar from "../../generic/components/TitleBar";

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
    group: "Playlists",
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
        try {
          const response = await postDiscoverDestination(
            ItemToDiscoverDestination(destination)
          );
          if (response.id === destination.id) {
            dispatch(selectDiscoverDestination(destination));
            close();
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
                setIsSearching(text.length > 0);
                setSearchText(text);
              }}
              hint={"Search your playlists"}
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
            {isSearching && (
              <TabListGroup
                items={SearchFilterItems(destinationItems, searchText)}
                onClickItem={onDestinationClick}
                selectedItem={selectedDestinationItem}
                useRoundedImage={() => true}
              />
            )}
          </div>
        </>
      )}
      {isLoading && <FullComponentLoader />}
    </div>
  );
}

export default DiscoverDestinationPicker;
