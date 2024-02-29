import { useState } from "react";
import IconButton from "./IconButton";
import "../styles/SearchArea.scss";

interface Props {
  onSearch: (text: string) => void;
  onTextChanged: (text: string) => void;
  hint: string;
  matchParentHeight?: boolean;
  millisToSettle?: number;
}

const defaultHeight = 3; //rem
const nullTimeoutHandle: NodeJS.Timeout | null = null;

function SearchArea({
  onSearch,
  onTextChanged,
  hint,
  matchParentHeight = false,
  millisToSettle = 1000,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const [lastTimeoutHandle, setLastTimeoutHandle] = useState(nullTimeoutHandle);

  //Instead of dispatching the search action on every keystroke, we allow the search to settle for period before dispatching.
  const dispatchSearchOnSettle = (dipatchSearchText: string) => {
    if (lastTimeoutHandle) {
      clearTimeout(lastTimeoutHandle); //Before we start a new timer to dispatch the current search stroke, cancel the timer for the last search stroke.
    }
    const handle = setTimeout(
      () => onSearch(dipatchSearchText),
      millisToSettle
    );
    setLastTimeoutHandle(handle);
  };

  return (
    <div
      className="search-area"
      style={{
        height: `${matchParentHeight ? "100%" : `${defaultHeight}rem`}`,
      }}
    >
      <div className="search-box">
        <img
          title="search"
          className="icon"
          src={"/src/assets/ic_search.svg"}
        />
        <input
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
      </div>
      {searchText.length > 0 && (
        <div className="cancel">
          <IconButton
            icon={"/src/assets/ic_close.png"}
            onAction={() => {
              setSearchText("");
              onTextChanged("");
            }}
            showBackground={false}
            matchParentHeight
          />
        </div>
      )}
    </div>
  );
}

export default SearchArea;
