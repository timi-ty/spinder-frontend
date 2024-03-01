import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../state/store";
import { useDiscoverSourceResource } from "../../utils/hooks";
import { searchDiscoverSources } from "../../client/client.api";
import FullComponentLoader from "../../loaders/components/FullComponentLoader";
import {
  DiscoverSource,
  DiscoverSourceData,
  emptySourceSearchResult,
} from "../../client/client.model";
import "../styles/DiscoverSourcePicker.scss";
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
    item.type == "Spinder People" ||
    item.type == "My Artists" ||
    item.type == "My Playlists"
  );
}

function DiscoverSourceToItem(item: DiscoverSource): DiscoverSourceItem {
  var graphic = item.image;
  switch (item.type) {
    case "Anything Me":
      graphic = "/src/assets/ic_anything_me_stars.svg";
      break;
    case "Spinder People":
      graphic = "/src/assets/ic_spinder_people_friends.svg";
      break;
    case "My Artists":
      graphic = "/src/assets/ic_my_artists_mic.svg";
      break;
    case "My Playlists":
      graphic = "/src/assets/ic_my_playlists_vinyl.svg";
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

function DiscoverSourcePicker({ close }: Props) {
  const dispatch = useDispatch();
  const resourceStatus = useDiscoverSourceResource();
  const discoverSourceData = useSelector<StoreState, DiscoverSourceData>(
    (state) => state.discoverSourceState.data
  );

  const [isLoading, setIsLoading] = useState(
    resourceStatus === "Loading" || resourceStatus === "Empty"
  ); //Also used as local loader for changing source. May want to change this.
  const [isSearching, setIsSearching] = useState(false);
  const [isResultUpdated, setIsResultUpdated] = useState(false);
  const [sourceSearchResult, setSourceSearchResult] = useState(
    emptySourceSearchResult
  );
  useEffect(
    () =>
      setIsLoading(resourceStatus === "Loading" || resourceStatus === "Empty"),
    [resourceStatus]
  );

  const onSearchTextChanged = (text: string) => {
    setIsSearching(text.length > 0);
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
    async (source: DiscoverSourceItem, isSelected: boolean = false) => {
      if (!isSelected) {
        setIsLoading(true);
        changeSource(
          ItemToDiscoverSource(source),
          (newSource) => {
            dispatch(selectDiscoverSource(newSource));
            setIsLoading(false);
            close();
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

  const availableSourceItems = useMemo(
    () =>
      discoverSourceData.availableSources.map((source) =>
        DiscoverSourceToItem(source)
      ),
    [discoverSourceData]
  );
  const searchedSourcedItems = useMemo(
    () =>
      [
        ...sourceSearchResult.artists,
        ...sourceSearchResult.playlists,
        ...sourceSearchResult.spinderPeople,
      ].map((source) => DiscoverSourceToItem(source)),
    [sourceSearchResult]
  );
  const selectedSourceItem = useMemo(
    () => DiscoverSourceToItem(discoverSourceData.selectedSource),
    [discoverSourceData]
  );

  return (
    <div className="source-picker">
      {!isLoading && (
        <>
          <div className="title">
            <TitleBar title={"Source"} onClose={() => close()} />
          </div>
          <div className="search">
            <SearchArea
              onSearch={onSearch}
              onTextChanged={onSearchTextChanged}
              hint={"Search for artists, playlists, spinder people..."}
            />
          </div>
          <div className="bottom">
            {!isSearching && !isCompositeSource(selectedSourceItem) && (
              <div
                className={`selected-source-item`}
                onClick={() => onSourceClick(selectedSourceItem, true)}
              >
                <img
                  className="icon"
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
                <div className="text">{selectedSourceItem.title}</div>
              </div>
            )}
            {!isSearching && (
              <BalancedGrid
                items={availableSourceItems}
                onClickItem={onSourceClick}
                selectedItem={selectedSourceItem}
                graphicType={"Icon"}
                showSelectedItem={isCompositeSource(selectedSourceItem)}
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
                      image: "/src/assets/ic_vibe_hashtag.png",
                      title: `${sourceSearchResult.searchText}`,
                      group: "Vibe",
                    },
                    false
                  )
                }
              />
            )}
            {isSearching && (
              <TabListGroup
                items={searchedSourcedItems}
                onClickItem={onSourceClick}
                selectedItem={selectedSourceItem}
                useRoundedImage={(item) => item.type === "Playlist"}
              />
            )}
          </div>
        </>
      )}
      {isLoading && <FullComponentLoader />}
    </div>
  );
}

export default DiscoverSourcePicker;
