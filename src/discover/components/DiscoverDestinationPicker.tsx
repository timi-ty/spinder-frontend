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
import ErrorOneMessageTwoAction from "../../generic/components/ErrorOneMessageTwoAction";
import { loadDiscoverDestination } from "../../utils/loaders";

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

  const [isLoadingPicker, setIsLoadingPicker] = useState(
    resourceStatus === "Loading" || resourceStatus === "Empty"
  );
  const [isPickerError, setIsPickerError] = useState(
    resourceStatus === "Error"
  );
  const [isLoadingDestinationChange, setIsLoadingDestinationChange] =
    useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    setIsLoadingPicker(
      resourceStatus === "Loading" || resourceStatus === "Empty"
    );
    setIsPickerError(resourceStatus === "Error");
  }, [resourceStatus]);

  const onDestinationClick = useCallback(
    async (
      destination: DiscoverDestinationItem,
      isSelected: boolean = false
    ) => {
      if (!isSelected) {
        setIsLoadingDestinationChange(true);
        changeDestination(
          ItemToDiscoverDestination(destination),
          (newDestination) => {
            dispatch(selectDiscoverDestination(newDestination));
            close();
            setIsLoadingDestinationChange(false);
          },
          () => {
            /*Show error, failed to change destination.*/
            setIsLoadingDestinationChange(false);
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

  const retryDestinationPicker = () => {
    //Load here interacts with redux to update the resource state which this picker listens to stay fresh.
    loadDiscoverDestination();
  };

  return (
    <div className="destination-picker">
      {!isLoadingPicker && !isLoadingDestinationChange && !isPickerError && (
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
      {(isLoadingPicker || isLoadingDestinationChange) && (
        <div className="loader-error-full-page">
          <FullComponentLoader />
        </div>
      )}
      {isPickerError && (
        <div className="loader-error-full-page">
          <ErrorOneMessageTwoAction
            message={"There was a problem loading the destination picker."}
            actionOne={{
              name: "Retry",
              action: () => {
                retryDestinationPicker();
              },
            }}
            actionTwo={{
              name: "Close",
              action: () => {
                close();
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default DiscoverDestinationPicker;
