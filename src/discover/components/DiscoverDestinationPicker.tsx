import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../state/store";
import { useDiscoverDestinationResource } from "../../utils/hooks";
import FullComponentLoader from "../../generic/components/FullComponentLoader";
import {
  DiscoverDestination,
  DiscoverDestinationData,
  emptyDestinationSearchResult,
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
import { searchDiscoverDestinations } from "../../client/client.api";
import { ToastContext } from "../../utils/context";

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
  const showToast = useContext(ToastContext);
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

  const [destinationSearchResult, setDestinationSearchResult] = useState(
    emptyDestinationSearchResult
  );
  const [isResultUpdated, setIsResultUpdated] = useState(false);
  const onSearch = (searchText: string) => {
    if (searchText === "") return;
    searchDiscoverDestinations(searchText)
      .then((result) => {
        setDestinationSearchResult(result);
        setIsResultUpdated(true); //As soon as we get new results, mark that no result is pending until the search text changes again.
      })
      .catch(() => {
        setDestinationSearchResult(emptyDestinationSearchResult); //An error means we have no results
        setIsResultUpdated(true);
      });
  };
  const onSearchTextChanged = (text: string) => {
    setIsSearching(text.length > 0);
    setSearchText(text);
    setIsResultUpdated(false); //As soon as the search text changes, mark that we are pending results.
  };

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
            setIsLoadingDestinationChange(false);
            closePicker();
          },
          () => {
            showToast(
              "Something went wrong, your destination did not change.",
              "Bottom"
            );
            setIsLoadingDestinationChange(false);
          }
        );
      }
    },
    []
  );

  const localDestinationItems = useMemo(
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

  const searchResults = useMemo(() => {
    const allItems = [...localDestinationItems];
    const localResultsMap: Set<string> = new Set();
    localDestinationItems.forEach((result) => localResultsMap.add(result.id));
    for (var i = 0; i < destinationSearchResult.playlists.length; i++) {
      const remoteResult = destinationSearchResult.playlists[i];
      if (!localResultsMap.has(remoteResult.id)) {
        allItems.push(DiscoverDestinationToItem(remoteResult));
      }
    }
    return SearchFilterItems(allItems, searchText);
  }, [localDestinationItems, searchText, destinationSearchResult]);

  const retryDestinationPicker = () => {
    //Load here interacts with redux to update the resource state which this picker listens to stay fresh.
    loadDiscoverDestination();
  };

  const [opacity, setOpacity] = useState(0);
  useEffect(() => setOpacity(1), []);

  const closePicker = () => {
    setOpacity(0);
    setTimeout(() => close(), 250);
  };

  return (
    <div className="destination-picker" style={{ opacity: `${opacity}` }}>
      {!isLoadingPicker && !isLoadingDestinationChange && !isPickerError && (
        <>
          <div className="title">
            <TitleBar title={"Destination"} onClose={() => closePicker()} />
          </div>
          <div className="search">
            <SearchArea
              onSearch={onSearch}
              onTextChanged={onSearchTextChanged}
              hint={"Search your playlists"}
              isLoading={isSearching && !isResultUpdated}
            />
          </div>
          <div className="bottom">
            {!isSearching && (
              <BalancedGrid
                items={localDestinationItems}
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
                closePicker();
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default DiscoverDestinationPicker;
