import { useCallback } from "react";
import "../styles/ActionSeach.scss";
import IconButton from "./IconButton";

interface Props {
  actionImage: string;
  onAction: () => void;
  onSearch: (text: string) => void;
}

function ActionSearch({ actionImage, onAction, onSearch }: Props) {
  const onSearchChanged = useCallback(
    (text: string) => {
      onSearch(text);
    },
    [onSearch]
  );

  return (
    <div className="action-search">
      <IconButton icon={actionImage} onAction={onAction} />
      <input
        className="search"
        type="search"
        onChange={(event) => {
          onSearchChanged(event.target.value);
        }}
      />
    </div>
  );
}

export default ActionSearch;
