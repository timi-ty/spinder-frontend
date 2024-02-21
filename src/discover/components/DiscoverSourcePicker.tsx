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
import ActionSearch from "../../generic/components/ActionSearch";
import TabListGroup, {
  TabListItem,
} from "../../generic/components/TabListGroup";
import BalancedGrid, {
  BalancedGridItem,
} from "../../generic/components/BalancedGrid";
import { selectDiscoverSource } from "../../state/slice.discoversource";
import { clearDeck } from "../../client/client.deck";

interface Props {
  onSourceSelected: () => void;
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
    image: item.image,
    group: item.type,
  };

  return sourceItem;
}

function DiscoverSourcePicker({ onSourceSelected }: Props) {
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
            onSourceSelected();
            setIsLoading(false);
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
          <div className="top">
            <ActionSearch
              actionImage={"/src/assets/ic_close.png"}
              onAction={onSourceSelected}
              onSearch={(text) => {
                setIsSearching(text.length > 0);
                setSearchText(text);
              }}
            />
          </div>
          <div className="bottom">
            {!isSearching && (
              <BalancedGrid
                items={availableSourceItems}
                onClickItem={onSourceClick}
                selectedItem={selectedDestinationItem}
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
