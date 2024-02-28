import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../state/store";
import { useDiscoverSourceResource } from "../../utils/hooks";
import {
  postDiscoverSource,
  searchDiscoverSources,
} from "../../client/client.api";
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
import { clearSourceDeck } from "../../client/client.deck";
import TitleBar from "../../generic/components/TitleBar";

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
  const [searchText, setSearchText] = useState("");
  const [sourceSearchResult, setSourceSearchResult] = useState(
    emptySourceSearchResult
  );
  useEffect(
    () =>
      setIsLoading(resourceStatus === "Loading" || resourceStatus === "Empty"),
    [resourceStatus]
  );
  useEffect(() => {
    if (searchText === "") return;
    searchDiscoverSources(searchText).then((result) =>
      setSourceSearchResult(result)
    );
  }, [searchText]);

  const onSourceClick = useCallback(
    async (source: DiscoverSourceItem, isSelected: boolean = false) => {
      if (!isSelected) {
        setIsLoading(true);
        clearSourceDeck();
        try {
          const response = await postDiscoverSource(
            ItemToDiscoverSource(source)
          );
          if (response.id === source.id) {
            dispatch(selectDiscoverSource(source));
            setIsLoading(false);
            close();
            return;
          }
          throw new Error(
            `Discover source set mismatch. Asked for ${source.id} but got ${response.id}.`
          );
        } catch (error) {
          console.error(error);
          console.error("Failed to set discover source.");
          setIsLoading(false);
        }
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
      [...sourceSearchResult.artists, ...sourceSearchResult.playlists].map(
        (source) => DiscoverSourceToItem(source)
      ),
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
              onSearch={(text) => {
                setIsSearching(text.length > 0);
                setSearchText(text);
              }}
              hint={"Search for artists, playlists, spinder people..."}
            />
          </div>
          <div className="bottom">
            {!isSearching && (
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
                showSelectedItem={false}
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
