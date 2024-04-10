import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import "../styles/SearchArea.scss";
import { nullTimeoutHandle } from "../../utils";

interface Props {
  onSearch: (text: string) => void;
  onTextChanged: (text: string) => void;
  hint: string;
  isLoading: boolean;
  matchParentHeight?: boolean;
  millisToSettle?: number;
}

const defaultHeight = 3; //rem

function SearchArea({
  onSearch,
  onTextChanged,
  hint,
  isLoading,
  matchParentHeight = false,
  millisToSettle = 1000,
}: Props) {
  const [searchText, setSearchText] = useState("");

  //Instead of dispatching the search action on every keystroke, we allow the search to settle for period before dispatching.
  const lastTimeoutHandle = useRef(nullTimeoutHandle);
  const dispatchSearchOnSettle = (dipatchSearchText: string) => {
    if (lastTimeoutHandle.current) {
      clearTimeout(lastTimeoutHandle.current); //Before we start a new timer to dispatch the current search stroke, cancel the timer for the last search stroke.
    }
    lastTimeoutHandle.current = setTimeout(
      () => onSearch(dipatchSearchText),
      millisToSettle
    );
  };

  const inputRef: LegacyRef<HTMLInputElement> = useRef(null);
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key.toLowerCase() === "enter") {
      inputRef.current?.blur();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const isSearching = searchText.length > 0;

  return (
    <div
      className="search-area"
      style={{
        height: `${matchParentHeight ? "100%" : `${defaultHeight}rem`}`,
        paddingRight: `${isSearching ? "" : "1rem"}`, //When we're searching the cancel button handles our right padding
      }}
    >
      <div className="search-box">
        <img title="Search" className="icon" src={"/resources/ic_search.svg"} />
        <input
          ref={inputRef}
          name="search"
          title="search"
          className="search"
          value={searchText}
          placeholder={hint}
          onChange={(event) => {
            setSearchText(event.target.value);
            onTextChanged(event.target.value);
            dispatchSearchOnSettle(event.target.value);
          }}
        />
        {isLoading && (
          <img
            title="Loader"
            className="loader"
            src={"/resources/ic_loader.svg"}
          />
        )}
      </div>
      {isSearching && (
        <div className="cancel">
          <IconButton
            icon={"/resources/ic_close.svg"}
            onAction={() => {
              setSearchText("");
              onTextChanged("");
            }}
            showBackground={false}
            matchParentHeight
            title={"Cancel"}
          />
        </div>
      )}
    </div>
  );
}

export default SearchArea;
