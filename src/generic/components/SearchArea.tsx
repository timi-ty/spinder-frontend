import { useRef, useState } from "react";
import IconButton from "./IconButton";
import "../styles/SearchArea.scss";
import { nullTimeoutHandle } from "../../utils/utils";

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

  return (
    <div
      className="search-area"
      style={{
        height: `${matchParentHeight ? "100%" : `${defaultHeight}rem`}`,
      }}
    >
      <div className="search-box">
        <img title="Search" className="icon" src={"/resources/ic_search.svg"} />
        <input
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
      {searchText.length > 0 && (
        <div className="cancel">
          <IconButton
            icon={"/resources/ic_close.png"}
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
