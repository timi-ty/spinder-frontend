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
import { clearDeck } from "../../client/client.deck";
import TitleBar from "../../generic/components/TitleBar";

interface Props {
  close: () => void;
}

interface DiscoverSourceItem
  extends DiscoverSource,
    TabListItem,
    BalancedGridItem {}

function DiscoverSourceToItem(item: DiscoverSource): DiscoverSourceItem {
  const sourceItem: DiscoverSourceItem = {
    type: item.type,
    id: item.id,
    name: item.name,
    title: item.name,
    image: "/src/assets/test_image.jpg",
    group: item.type,
  };

  return sourceItem;
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
        clearDeck();
        try {
          const response = await postDiscoverSource(source);
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
  const selectedDestinationItem = useMemo(
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
              <BalancedGrid
                items={availableSourceItems}
                onClickItem={onSourceClick}
                selectedItem={selectedDestinationItem}
                graphicType={"Icon"}
              />
            )}
            {isSearching && (
              <TabListGroup
                items={searchedSourcedItems}
                onClickItem={onSourceClick}
                selectedItem={selectedDestinationItem}
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
