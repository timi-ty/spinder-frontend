import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../state/store";
import { searchDiscoverSources } from "../../client/client.api";
import FullComponentLoader from "../../generic/components/FullComponentLoader";
import {
  DiscoverSource,
  DiscoverSourceData,
  emptySourceSearchResult,
} from "../../client/client.model";
import styles from "../styles/DiscoverSourcePicker.module.css";
import SearchArea from "../../generic/components/SearchArea";
import TabListGroup, {
  TabListItem,
} from "../../generic/components/TabListGroup";
import BalancedGrid, {
  BalancedGridItem,
} from "../../generic/components/BalancedGrid";
import { selectDiscoverSource } from "../../state/slice.discoversource";
import TitleBar from "../../generic/components/TitleBar";
import DiscoverVibePicker from "./DiscoverVibePicker";
import { changeSource } from "../../client/client.deck";
import EmptyView from "../../generic/components/EmptyView";
import ErrorOneMessageTwoAction from "../../generic/components/ErrorOneMessageTwoAction";
import { ToastContext } from "../../overlays/components/ToastProvider";
import useDiscoverSourceResource from "../../resource-hooks/useDiscoverSourceResource";
import { AuthMode } from "../../state/slice.auth";
import useAction from "../../utility-hooks/useAction";

interface Props {
  close: () => void;
}

interface DiscoverSourceItem
  extends DiscoverSource,
    TabListItem,
    BalancedGridItem {}

function isCompositeSource(item: DiscoverSource): boolean {
  return (
    item.type == "Anything Me" ||
    item.type == "Spindr People" ||
    item.type == "My Artists" ||
    item.type == "My Playlists"
  );
}

function DiscoverSourceToItem(item: DiscoverSource): DiscoverSourceItem {
  var graphic = item.image;
  switch (item.type) {
    case "Anything Me":
      graphic = "/resources/ic_anything_me_stars.svg";
      break;
    case "Spindr People":
      graphic = "/resources/ic_spinder_people_friends.svg";
      break;
    case "My Artists":
      graphic = "/resources/ic_my_artists_mic.svg";
      break;
    case "My Playlists":
      graphic = "/resources/ic_my_playlists_vinyl.svg";
      break;
  }

  const sourceItem: DiscoverSourceItem = {
    type: item.type,
    id: item.id,
    name: item.name,
    title: item.name,
    image: graphic,
    group: item.type,
  };

  return sourceItem;
}

function ItemToDiscoverSource(item: DiscoverSourceItem): DiscoverSource {
  const discoverSource: DiscoverSource = {
    type: item.type,
    id: item.id,
    name: item.name,
    image: item.image,
  };

  return discoverSource;
}

function SearchFilterItems(
  items: DiscoverSourceItem[],
  searchText: string
): DiscoverSourceItem[] {
  return items.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );
}

function DiscoverSourcePicker({ close }: Props) {
  const showToast = useContext(ToastContext);
  const dispatch = useDispatch();
  const { resourceStatus, loadDiscoverSource: reloadDiscoverSourceResource } =
    useDiscoverSourceResource();
  const discoverSourceData = useSelector<StoreState, DiscoverSourceData>(
    (state) => state.discoverSourceState.data
  );

  const [isLoadingPicker, setIsLoadingPicker] = useState(
    resourceStatus === "Loading" || resourceStatus === "Empty"
  );
  const [isPickerError, setIsPickerError] = useState(
    resourceStatus === "Error"
  );
  const [isLoadingSourceChange, setIsLoadingSourceChange] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isResultUpdated, setIsResultUpdated] = useState(false);
  const [sourceSearchResult, setSourceSearchResult] = useState(
    emptySourceSearchResult
  );
  useEffect(() => {
    setIsLoadingPicker(
      resourceStatus === "Loading" || resourceStatus === "Empty"
    );
    setIsPickerError(resourceStatus === "Error");
  }, [resourceStatus]);

  const onSearchTextChanged = (text: string) => {
    setIsSearching(text.length > 0);
    setSearchText(text);
    setIsResultUpdated(false); //As soon as the search text changes, mark that we are pending results.
  };

  const onSearch = (searchText: string) => {
    if (searchText === "") return;
    searchDiscoverSources(searchText)
      .then((result) => {
        setSourceSearchResult(result);
        setIsResultUpdated(true); //As soon as we get new results, mark that no result is pending until the search text changes again.
      })
      .catch(() => {
        setSourceSearchResult(emptySourceSearchResult); //An error means we have no results
        setIsResultUpdated(true);
      });
  };

  const onSourceClick = useCallback(
    (source: DiscoverSourceItem, isSelected: boolean = false) => {
      if (!isSelected) {
        setIsLoadingSourceChange(true);
        changeSource(
          ItemToDiscoverSource(source),
          (newSource) => {
            dispatch(selectDiscoverSource(newSource));
            setIsLoadingSourceChange(false);
            closePicker();
          },
          () => {
            showToast(
              "Something went wrong, your source did not change.",
              "Bottom"
            );
            setIsLoadingSourceChange(false);
          }
        );
      }
    },
    []
  );

  const availableSourceItems = useMemo(
    () =>
      discoverSourceData.availableSources.map((source) =>
        DiscoverSourceToItem(source)
      ),
    [discoverSourceData]
  );
  const searchedSourcedItems = useMemo(
    () =>
      SearchFilterItems(
        [
          ...sourceSearchResult.artists,
          ...sourceSearchResult.playlists,
          ...sourceSearchResult.spinderPeople,
        ].map((source) => DiscoverSourceToItem(source)),
        searchText
      ),
    [sourceSearchResult, searchText]
  );
  const selectedSourceItem = useMemo(
    () => DiscoverSourceToItem(discoverSourceData.selectedSource),
    [discoverSourceData]
  );

  const retrySourcePicker = () => {
    //Load here interacts with redux to update the resource state which this picker listens to stay fresh.
    reloadDiscoverSourceResource();
  };

  const [opacity, setOpacity] = useState(0);
  useEffect(() => setOpacity(1), []);

  const closePicker = () => {
    setOpacity(0);
    setTimeout(() => close(), 250);
  };

  const doAction = useAction();

  const authMode = useSelector<StoreState, AuthMode>(
    (state) => state.authState.mode
  );

  function getGridSourceItemClass(item: DiscoverSourceItem) {
    const requiresFullAuth =
      item.type === "Anything Me" ||
      item.type === "My Artists" ||
      item.type === "My Playlists";
    return requiresFullAuth && authMode !== "Full" ? "unauth-action" : "";
  }

  function gridSourceItemAction(item: DiscoverSourceItem, isSelected: boolean) {
    const requiresFullAuth =
      item.type === "Anything Me" ||
      item.type === "My Artists" ||
      item.type === "My Playlists";
    doAction(() => onSourceClick(item, isSelected), {
      requiresFullAuth: requiresFullAuth,
      actionDescription: `get recommendations from "${item.name}"`,
    });
  }

  return (
    <div className={styles.sourcePicker} style={{ opacity: `${opacity}` }}>
      {!isLoadingPicker && !isLoadingSourceChange && !isPickerError && (
        <>
          {!isSearching && (
            <div className={styles.title}>
              <TitleBar title={"Source"} onClose={() => closePicker()} />
            </div>
          )}
          <div className={styles.search}>
            <SearchArea
              onSearch={onSearch}
              onTextChanged={onSearchTextChanged}
              hint={"Search for artists, playlists, spinder people..."}
              isLoading={isSearching && !isResultUpdated}
            />
          </div>
          {/* When searching, the title bar goes away which allows the bottom to occupy more space. */}
          <div
            className={styles.bottom}
            style={{ height: `${isSearching ? "calc(100% - 5rem)" : ""}` }}
          >
            {!isSearching && !isCompositeSource(selectedSourceItem) && (
              <div
                className={styles.selectedSourceItem}
                onClick={() => onSourceClick(selectedSourceItem, true)}
              >
                <img
                  title={selectedSourceItem.name}
                  className={styles.icon}
                  src={selectedSourceItem.image}
                  style={{
                    clipPath: `${
                      isCompositeSource(selectedSourceItem) ||
                      selectedSourceItem.type === "Playlist"
                        ? ""
                        : "circle()"
                    }`,
                    borderRadius: `${
                      selectedSourceItem.type === "Playlist" ? "0.25rem" : ""
                    }`,
                    width: `${
                      isCompositeSource(selectedSourceItem) ? "" : "3rem"
                    }`,
                  }}
                />
                <div className={styles.text}>{selectedSourceItem.title}</div>
              </div>
            )}
            {!isSearching && (
              <BalancedGrid
                items={availableSourceItems}
                onClickItem={gridSourceItemAction}
                selectedItem={selectedSourceItem}
                graphicType={"Icon"}
                showSelectedItem={isCompositeSource(selectedSourceItem)}
                className={getGridSourceItemClass}
              />
            )}
            {isSearching && (
              <DiscoverVibePicker
                pickerStatus={
                  isResultUpdated
                    ? sourceSearchResult.foundVibe
                      ? "Found"
                      : "Not Found"
                    : "Searching"
                }
                vibeName={sourceSearchResult.searchText}
                onClick={() =>
                  onSourceClick(
                    {
                      type: "Vibe",
                      id: `${sourceSearchResult.searchText}`,
                      name: `${sourceSearchResult.searchText}`,
                      image: "/resources/ic_vibe_hashtag.png",
                      title: `${sourceSearchResult.searchText}`,
                      group: "Vibe",
                    },
                    false
                  )
                }
              />
            )}
            {isSearching && searchedSourcedItems.length > 0 && (
              <TabListGroup
                items={searchedSourcedItems}
                onClickItem={onSourceClick}
                selectedItem={selectedSourceItem}
                useRoundedImage={(item) => item.type === "Playlist"}
              />
            )}
            {isSearching &&
              !isResultUpdated &&
              searchedSourcedItems.length === 0 && (
                <div className={styles.loaderEmpty}>
                  <FullComponentLoader />
                </div>
              )}
            {isSearching &&
              isResultUpdated &&
              searchedSourcedItems.length === 0 && (
                <div className={styles.loaderEmpty}>
                  <EmptyView />
                </div>
              )}
          </div>
        </>
      )}
      {(isLoadingPicker || isLoadingSourceChange) && (
        <div className={styles.loaderErrorFullPage}>
          <FullComponentLoader />
        </div>
      )}
      {isPickerError && (
        <div className={styles.loaderErrorFullPage}>
          <ErrorOneMessageTwoAction
            message={"There was a problem loading the source picker."}
            actionOne={{
              name: "Retry",
              action: () => {
                retrySourcePicker();
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

export default DiscoverSourcePicker;
