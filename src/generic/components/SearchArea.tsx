import { useState } from "react";
import IconButton from "./IconButton";
import "../styles/SearchArea.scss";

interface Props {
  onSearch: (text: string) => void;
  matchParentHeight?: boolean;
}

const defaultHeight = 3; //rem

function SearchArea({ onSearch, matchParentHeight = false }: Props) {
  const [searchText, setSearchText] = useState("");

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
          onChange={(event) => {
            setSearchText(event.target.value);
            onSearch(event.target.value);
          }}
        />
      </div>
      {searchText.length > 0 && (
        <div className="cancel">
          <IconButton
            icon={"/src/assets/ic_close.png"}
            onAction={() => {
              setSearchText("");
              onSearch("");
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
